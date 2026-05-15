import type { Category } from './types';

export const SHEET_ID = '1kdgiVjGtQgqkAecx-tFoWggnR9tQ4veXWp72_K9E_Ho';

export const DEFAULT_CATS: Category[] = [
  {
    id: 'cat-1', name: 'Havacılık',
    subs: [{ id: 'sub-1-1', name: 'Uçak Maketleri' }],
  },
  {
    id: 'cat-2', name: 'Yaşam Tarzı',
    subs: [
      { id: 'sub-2-1', name: 'Ofis' },
      { id: 'sub-2-2', name: 'Giyim' },
      { id: 'sub-2-3', name: 'Kitap & Katalog' },
      { id: 'sub-2-4', name: 'Takı & Aksesuar' },
      { id: 'sub-2-5', name: 'Elektronik' },
      { id: 'sub-2-6', name: 'Çocuk Ürünleri' },
      { id: 'sub-2-7', name: 'Termos & Mug' },
      { id: 'sub-2-8', name: 'Ev & Yaşam' },
      { id: 'sub-2-9', name: 'Hobi' },
    ],
  },
  {
    id: 'cat-3', name: 'Seyahat',
    subs: [
      { id: 'sub-3-1', name: 'Seyahat Aksesuarları' },
      { id: 'sub-3-2', name: 'Seyahat Setleri' },
      { id: 'sub-3-3', name: 'Valiz & Çanta' },
    ],
  },
  {
    id: 'cat-4', name: 'Kültürel Miras',
    subs: [
      { id: 'sub-4-1', name: 'TK Koleksiyon' },
      { id: 'sub-4-2', name: 'Yerel & Kültürel Ürünler' },
      { id: 'sub-4-3', name: 'Unesco' },
    ],
  },
];

export const THY_SYSTEM_PROMPT = `You are a product copywriter for Turkish Airlines' official merchandise store. Turkish Airlines' brand identity is built around "Widen Your World" — a philosophy of connecting cultures, celebrating excellence, and embodying the pride of global aviation leadership.

THY Brand Voice:
- Aspirational and prestigious, yet warm and accessible
- Celebrates Turkish heritage and global connectivity
- Confident, elegant, and polished — never boastful
- Inspires wanderlust and a sense of belonging to a global community
- References: quality craftsmanship, journey, destinations, sky, heritage, pride

Writing Rules:
- ONE paragraph only (3-4 sentences)
- Begin with an evocative sentence that connects the product to travel/journey/aviation spirit
- Highlight quality and brand prestige subtly
- End with a subtle invitation to own a piece of the THY world
- NEVER mention prices, sizes, or technical specs
- NEVER use superlatives like "best" or "perfect"
- Avoid clichés; write with originality

You will receive: Product Name, Category, Subcategory, Product Code.
Respond ONLY with a valid JSON object — no markdown, no backticks, no preamble:
{"tr": "Türkçe açıklama...", "en": "English description..."}`;
