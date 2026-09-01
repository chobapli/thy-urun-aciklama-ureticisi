# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proje Özeti

TK Store İçerik Üretimi — Turkish Airlines resmi mağazası için ürün açıklaması üretme aracı. React 19 + Vite + TypeScript SPA. Ürünler Firestore'da, kategoriler localStorage'da tutulur. Claude `claude-sonnet-4-6` modeli hem Türkçe hem İngilizce tek paragraflık açıklama üretir; ürün görselleri vision (image URL block) ile API'ye gönderilir. Giriş Firebase Auth (email/şifre) ile korunur.

## Komutlar

```bash
npm run dev       # Vite geliştirme sunucusu
npm run build     # tsc -b + Vite build → dist/
npm run lint      # ESLint
npm run preview   # dist/ önizleme

# Deploy (önce GitHub'a push, sonra):
npm run build && firebase deploy --only hosting
```

Test yok. `firebase.json` hosting dışında `firestore` ve `storage` kurallarını da içerir (`firebase deploy --only firestore:rules,storage`).

## Ortam Değişkenleri (.env)

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_FIREBASE_API_KEY=AIzaSy...
```

Diğer Firebase config değerleri (`projectId: tk-store-icerik`, appId, authDomain vb.) `src/lib/firebase.ts` içinde sabit.

## Mimari

### Veri Akışı

- **Ürünler** → Firestore `products` koleksiyonu (gerçek zamanlı `onSnapshot`, `createdAt` sıralı). Eski belgelerde tekil `imageUrl` alanı varsa `useProducts` bunu `imageUrls: [imageUrl]` dizisine migrate eder.
- **Kategoriler** → `localStorage` (`categories` anahtarı), `DEFAULT_CATS` varsayılanı ile (`src/constants.ts`). ID formatı `cat-XXXXXXX` / `sub-XXXXXXX`, `uid()` ile üretilir.
- **Görseller** → Firebase Storage (`products/` yolu), base64 değil. Yüklemede public URL alınır.
- **Açıklama üretimi** → Anthropic API doğrudan tarayıcıdan (`dangerouslyAllowBrowser: true`).
- **Auth** → Firebase Auth email/şifre. `useAuth` içinde `USERNAME_MAP` kullanıcı adını sabit bir email'e çevirir (şifre kodda yok). Kullanıcı yoksa `App` sadece `LoginPage` render eder.

> Firestore ve Storage kuralları şu an `allow read, write: if true` — herkese açık. Auth yalnızca UI seviyesinde koruma sağlar.

### Hook'lar

| Hook | Sorumluluk |
|------|-----------|
| `useAuth` | Firebase Auth durum takibi, `login(username, password)` / `logout` |
| `useProducts` | Firestore CRUD, optimistik UI, `imageUrl` → `imageUrls` migrasyonu |
| `useCategories` | localStorage okuma/yazma (300ms debounce), kategori/alt kategori CRUD: `addCategory`, `renameCategory`, `deleteCategory`, `addSubcategory`, `renameSubcategory`, `deleteSubcategory` |
| `useGenerate` | Tekli (`generateOne`) ve toplu (`generateBatch`) üretim, `cancelRef` ile iptal |

### Toplu Üretim

`generateBatch` yalnızca `pending` veya `error` durumundaki ürünleri hedefler. İstekler arasına 600ms `sleep` (rate limit). İptal `cancelRef` (ref, state değil — async döngüde anlık okunmalı) ile.

### Claude Entegrasyonu (`src/lib/anthropic.ts`)

- Model: `claude-sonnet-4-6`, `max_tokens: 1000`
- System prompt: `THY_SYSTEM_PROMPT` (`src/constants.ts`) — "Widen Your World" marka sesi, tek paragraf, ikinci şahıs, süperlatif yasağı, JSON çıktı
- `generateDescriptions(name, catName, subName, code, imageUrls?, extraInfo?, techSpecs?)`
- `imageUrls` varsa image block'ları metinden önce eklenir
- `extraInfo` → "Extra context" satırı; `techSpecs` → "Technical Specifications" satırı (metne doğal işlenir, liste yapılmaz)
- `clean()` lone surrogate'ları temizler (JSON UTF-8 kırılmasını önler) — tüm string girdilere uygulanır
- Yanıt `{"tr": "...", "en": "..."}`; `JSON.parse` başarısızsa regex fallback, o da olmazsa hata
- Türkçe metinde marka "Türk Hava Yolları", İngilizce'de "Turkish Airlines" (system prompt uygular)

### İsimlendirme Tutarsızlıkları

- `THY_SYSTEM_PROMPT` sabit adı "THY" içerir ama içerik "Türk Hava Yolları" / "Turkish Airlines" kullanır
- `exportCSV` dosya adı `thy-urun-YYYY-MM-DD.csv` (eski isim, kasıtlı)

### CSV (`src/lib/csv.ts`)

- **Import** (`parseCSV`): başlıklar `kod, kategori, alt_kategori, ad, görsel_url`. Kategori/alt kategori adı Firestore id'ye çevrilir. Sadece `,` ile split — tırnaklı/virgüllü değer desteği yok.
- **Export** (`exportCSV`): BOM'lu UTF-8, tüm alanlar tırnak içinde, çoklu görsel `;` ile birleşik.

### UI Layout ve Component Ağacı

`App.tsx` tüm hook'ları tutar, state'i aşağı iletir. `components/` klasörleri: `Auth/`, `Layout/`, `Main/`, `Modals/`, `Sidebar/`, `UI/`.

```
App  (h-screen flex flex-col overflow-hidden)
├── LoginPage                       (!user iken tek render)
├── Header                          (logo + onLogout)
└── div.flex.flex-1.min-h-0
    ├── Sidebar
    │   ├── ProductForm             (tekil ekleme)
    │   ├── ImageUpload             (Firebase Storage yükleme)
    │   ├── CsvUpload → parseCSV
    │   ├── BatchGenerate
    │   └── CategoryManager
    └── main (overflow-y-auto)
        ├── StatsBar / BatchProgress / SearchBar (search App state'inde)
        └── ProductTable            (filtrelenmiş, düzenle/sil)
ProductModal   (editingProduct !== null)
ToastContainer
```

### Renkler / Tailwind

Tailwind kullanılıyor. Marka renkleri `tailwind.config.js` `theme.extend.colors` altında token olarak: `bg #0D0D0D`, `sidebar #161616`, `header #C8102E`, `border #222`, `text-main #FAFAF8`, `text-secondary #666`, `cat-badge`, `subcat-badge` vb. `App.tsx` kök arka planı ayrıca inline style ile de veriyor.

### Firebase

- Proje ID: `tk-store-icerik`
- Hosting `dist/` sunar, SPA rewrite tüm yolları `index.html`'e yönlendirir
- `db`, `storage`, `auth` `src/lib/firebase.ts`'den export edilir

### Ürün Durumu

`Product.status`: `pending` → `generating` → `done` | `error`. Üretim hatası ürünü `error`'a çeker; toplu üretim `error` ürünlerini tekrar dener.
