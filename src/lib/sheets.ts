import { SHEET_ID } from '../constants';
import type { Product } from '../types';
import type { Category } from '../types';

const BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export async function exportToSheets(
  products: Product[],
  categories: Category[],
  token: string
): Promise<void> {
  const doneProducts = products.filter((p) => p.status === 'done');

  // Önce temizle
  await fetch(
    `${BASE}/${SHEET_ID}/values/Sheet1!A1:Z1000:clear`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    }
  );

  const getCatName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || '';
  const getSubName = (catId: string, subId: string) =>
    categories.find((c) => c.id === catId)?.subs.find((s) => s.id === subId)?.name || '';

  const header = ['Ürün Kodu', 'Kategori', 'Alt Kategori', 'Ürün Adı', 'Açıklama (TR)', 'Açıklama (EN)', 'Görsel URL'];
  const rows = doneProducts.map((p) => [
    p.code,
    getCatName(p.catId),
    getSubName(p.catId, p.subId),
    p.name,
    p.descTR,
    p.descEN,
    p.imageUrl.startsWith('data:') ? '[Yüklenen Görsel]' : p.imageUrl,
  ]);

  await fetch(
    `${BASE}/${SHEET_ID}/values/Sheet1!A1?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [header, ...rows] }),
    }
  );
}
