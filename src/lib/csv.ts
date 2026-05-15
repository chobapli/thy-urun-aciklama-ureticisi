import type { Product, Category } from '../types';

export function parseCSV(text: string, categories: Category[]): Partial<Product>[] {
  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const kodIdx = headers.findIndex((h) => h === 'kod');
  const catIdx = headers.findIndex((h) => h === 'kategori');
  const subIdx = headers.findIndex((h) => h === 'alt_kategori');
  const adIdx = headers.findIndex((h) => h === 'ad');
  const imgIdx = headers.findIndex((h) => h === 'görsel_url');

  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    const catName = catIdx >= 0 ? cols[catIdx] : '';
    const subName = subIdx >= 0 ? cols[subIdx] : '';

    const cat = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
    const sub = cat?.subs.find((s) => s.name.toLowerCase() === subName.toLowerCase());

    return {
      code: kodIdx >= 0 ? cols[kodIdx] : '',
      name: adIdx >= 0 ? cols[adIdx] : '',
      catId: cat?.id || '',
      subId: sub?.id || '',
      imageUrl: imgIdx >= 0 ? cols[imgIdx] : '',
      status: 'pending' as const,
      descTR: '',
      descEN: '',
    };
  });
}

export function exportCSV(products: Product[], categories: Category[]): void {
  const getCatName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || '';
  const getSubName = (catId: string, subId: string) =>
    categories.find((c) => c.id === catId)?.subs.find((s) => s.id === subId)?.name || '';

  const header = 'Ürün Kodu,Kategori,Alt Kategori,Ürün Adı,Açıklama (TR),Açıklama (EN),Görsel URL,Durum';
  const rows = products.map((p) => {
    const imgVal = p.imageUrl.startsWith('data:') ? '[Yüklenen Görsel]' : p.imageUrl;
    return [
      p.code,
      getCatName(p.catId),
      getSubName(p.catId, p.subId),
      p.name,
      p.descTR,
      p.descEN,
      imgVal,
      p.status,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',');
  });

  const bom = '﻿';
  const content = bom + [header, ...rows].join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().split('T')[0];
  a.download = `thy-urun-${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
