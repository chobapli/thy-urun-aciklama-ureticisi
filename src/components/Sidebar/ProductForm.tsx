import { useState } from 'react';
import type { Category, Product } from '../../types';
import { Button } from '../UI/Button';
import { ImageUpload } from './ImageUpload';

interface ProductFormProps {
  categories: Category[];
  onAdd: (data: Omit<Product, 'id' | 'status' | 'descTR' | 'descEN'>) => void;
}

export function ProductForm({ categories, onAdd }: ProductFormProps) {
  const [code, setCode] = useState('');
  const [catId, setCatId] = useState('');
  const [subId, setSubId] = useState('');
  const [name, setName] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [extraInfo, setExtraInfo] = useState('');

  const selectedCat = categories.find((c) => c.id === catId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ code, catId, subId, name, imageUrls, extraInfo: extraInfo.trim() || undefined });
    setCode('');
    setName('');
    setImageUrls([]);
    setExtraInfo('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-text-secondary text-xs font-medium uppercase tracking-wide block mb-1">
          Ürün Kodu
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="TK-001"
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-main placeholder:text-text-secondary focus:outline-none focus:border-[#444]"
        />
      </div>

      <div>
        <label className="text-text-secondary text-xs font-medium uppercase tracking-wide block mb-1">
          Kategori
        </label>
        <select
          value={catId}
          onChange={(e) => { setCatId(e.target.value); setSubId(''); }}
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-[#444]"
        >
          <option value="">Seçin...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {selectedCat && (
        <div>
          <label className="text-text-secondary text-xs font-medium uppercase tracking-wide block mb-1">
            Alt Kategori
          </label>
          <select
            value={subId}
            onChange={(e) => setSubId(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-[#444]"
          >
            <option value="">Seçin...</option>
            {selectedCat.subs.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-text-secondary text-xs font-medium uppercase tracking-wide block mb-1">
          Ürün Adı <span className="text-error-color">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ürün adını girin"
          required
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-main placeholder:text-text-secondary focus:outline-none focus:border-[#444]"
        />
      </div>

      <ImageUpload imageUrls={imageUrls} onImagesChange={setImageUrls} />

      <div>
        <label className="text-text-secondary text-xs font-medium uppercase tracking-wide block mb-1">
          Ekstra Bilgi <span className="text-text-secondary font-normal normal-case">(opsiyonel)</span>
        </label>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          placeholder="Açıklamayı yönlendirmek için ek bağlam..."
          rows={2}
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-main placeholder:text-text-secondary focus:outline-none focus:border-[#444] resize-none"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        + Ürün Ekle
      </Button>
    </form>
  );
}
