# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proje Özeti

TK Store İçerik Üretimi — Turkish Airlines resmi mağazası için ürün açıklaması üretme aracı. Ürünler Firestore'da saklanır, kategoriler localStorage'da tutulur. Claude `claude-sonnet-4-6` modeli hem Türkçe hem İngilizce açıklama üretir; görseller vision ile API'ye gönderilir.

## Komutlar

```bash
npm run dev       # Vite geliştirme sunucusu
npm run build     # TypeScript derleme + Vite build (dist/)
npm run lint      # ESLint
npm run preview   # dist/ klasörünü önizle

# Deploy
npm run build && firebase deploy --only hosting
```

## Ortam Değişkenleri (.env)

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_FIREBASE_API_KEY=AIzaSy...
```

## Mimari

### Veri Akışı

- **Ürünler** → Firestore `products` koleksiyonu (gerçek zamanlı `onSnapshot`, `createdAt` sıralı)
- **Kategoriler** → `localStorage` (`categories` anahtarı), varsayılan `DEFAULT_CATS` ile (`src/constants.ts`)
- **Açıklama üretimi** → Anthropic API doğrudan tarayıcıdan (`dangerouslyAllowBrowser: true`)

### Hook'lar

| Hook | Sorumluluk |
|------|-----------|
| `useProducts` | Firestore CRUD, optimistik UI güncellemesi |
| `useCategories` | localStorage okuma/yazma, 300ms debounce, CRUD operasyonları |
| `useGenerate` | Tekli ve toplu açıklama üretimi, iptal ref'i ile |

`useCategories` kategori/alt kategori için `addCategory`, `renameCategory`, `deleteCategory`, `addSubcategory`, `renameSubcategory`, `deleteSubcategory` fonksiyonları döner. ID'ler `uid()` ile rastgele üretilir (`cat-XXXXXXX` / `sub-XXXXXXX` formatı).

### Toplu Üretim

`useGenerate.generateBatch` yalnızca `pending` veya `error` durumundaki ürünleri hedef alır. API rate limit için istekler arasına 600ms `sleep` eklenir. İptal için `cancelRef` (ref) kullanılır — state değil, çünkü async döngü içinde anlık okunması gerekir.

### Claude Entegrasyonu (`src/lib/anthropic.ts`)

- Model: `claude-sonnet-4-6`
- System prompt: `THY_SYSTEM_PROMPT` (`src/constants.ts`) — TK marka sesi, JSON çıktı formatı
- Görsel varsa URL image block'ları metin içeriğinden önce gönderilir
- Opsiyonel `extraInfo` alanı varsa prompt'a "Extra context" satırı olarak eklenir
- Yanıt: `{"tr": "...", "en": "..."}` — JSON parse başarısız olursa regex fallback devreye girer
- Markayı her zaman "TK" olarak yaz, "THY" değil (sistem prompt'u bunu uygular)

### Isimlendirme Tutarsızlıkları

Kodu okurken kafa karıştırabilecek iki tutarsızlık:
- `THY_SYSTEM_PROMPT` sabit adı hâlâ "THY" içeriyor, ancak içeriği "TK" kullanıyor
- `exportCSV` çıktı dosya adı `thy-urun-YYYY-MM-DD.csv` (eski isim, kasıtlı bırakılmış olabilir)

### CSV

- **Import** (`parseCSV`): `kod, kategori, alt_kategori, ad, görsel_url` başlıkları. Kategori/alt kategori adı Firestore id'ye dönüştürülür. Virgülle ayrılmış format — içinde virgül olan değerler için tırnak desteği yok (split sadece `,` ile yapılır).
- **Export** (`exportCSV`): BOM ile UTF-8, `thy-urun-YYYY-MM-DD.csv` olarak indirilir. Tüm alanlar tırnak içine alınır, çoklu görseller `;` ile birleştirilir.

### Firebase

- Proje ID: `tk-store-icerik`
- Hosting `dist/` klasörünü sunar, SPA için tüm yollar `index.html`'e yönlendirilir
- `db` `src/lib/firebase.ts`'den export edilir

### Ürün Durumu

`Product.status`: `pending` → `generating` → `done` | `error`

Eski Firestore belgelerinde `imageUrl` (tekil) alanı varsa `useProducts` bunu `imageUrls: [imageUrl]` dizisine migrate eder.

### UI Layout ve Component Ağacı

`App.tsx` tüm hook'ları bir arada tutar ve state'i aşağı iletir:

```
App
├── Header                          (stateless, sadece logo)
├── Sidebar
│   ├── ProductForm                 (tekil ürün ekleme)
│   ├── CsvUpload → parseCSV        (toplu import)
│   ├── BatchGenerate               (toplu üretim tetikleyici)
│   └── CategoryManager             (localStorage kategori yönetimi)
├── main (overflow-y-auto)
│   ├── StatsBar                    (pending/generating/done/error sayıları)
│   ├── BatchProgress               (ilerleme çubuğu, iptal butonu)
│   ├── SearchBar                   (ad/kod/kategori filtresi, App state'inde)
│   └── ProductTable                (filtrelenmiş ürünler, düzenle/sil)
├── ProductModal                    (editingProduct !== null olduğunda görünür)
└── ToastContainer
```

`App.tsx` `h-screen flex flex-col overflow-hidden` ile tüm viewport'u kaplar; `<main>` `overflow-y-auto` ile bağımsız scroll sağlar. Sidebar sabit genişlikte, ana içerik `flex-1`. Renk paleti inline style ile tanımlı: arka plan `#0D0D0D`, yazı `#FAFAF8`.
