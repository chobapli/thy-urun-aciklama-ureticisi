import { useState } from 'react';
import type { Product, Category } from '../../types';
import { Button } from '../UI/Button';

interface ProductModalProps {
  product: Product;
  categories: Category[];
  onSave: (updates: Partial<Product>) => void;
  onGenerate: (product: Product) => Promise<void>;
  onClose: () => void;
}

export function ProductModal({ product, categories, onSave, onGenerate, onClose }: ProductModalProps) {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [descTR, setDescTR] = useState(product.descTR);
  const [descEN, setDescEN] = useState(product.descEN);
  const [generating, setGenerating] = useState(false);

  const catName = categories.find((c) => c.id === product.catId)?.name || '';
  const subName = categories.find((c) => c.id === product.catId)?.subs.find((s) => s.id === product.subId)?.name || '';

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await onGenerate({ ...product, descTR, descEN });
      // Üretim tamamlandığında parent state'ten güncel değerleri al
      onSave({ descTR, descEN });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({ descTR, descEN });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-sidebar border border-border rounded-xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-text-main font-bold text-lg">{product.name}</h2>
              <p className="text-text-secondary text-xs mt-1 font-mono">
                {product.code}
                {catName && ` • ${catName}`}
                {subName && ` › ${subName}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-main text-xl leading-none ml-4"
            >
              ×
            </button>
          </div>

          {/* Dil Seçici */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setLang('tr')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                lang === 'tr'
                  ? 'bg-header text-white'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              🇹🇷 Türkçe
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                lang === 'en'
                  ? 'bg-header text-white'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {lang === 'tr' ? (
            <textarea
              value={descTR}
              onChange={(e) => setDescTR(e.target.value)}
              placeholder="Türkçe açıklama buraya gelecek..."
              rows={6}
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-main text-sm resize-none focus:outline-none focus:border-[#444] placeholder:text-text-secondary"
            />
          ) : (
            <textarea
              value={descEN}
              onChange={(e) => setDescEN(e.target.value)}
              placeholder="English description goes here..."
              rows={6}
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-main text-sm resize-none focus:outline-none focus:border-[#444] placeholder:text-text-secondary"
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? '⏳ Üretiliyor...' : descTR || descEN ? '↺ Yeniden Üret' : '⚡ Üret'}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>İptal</Button>
            <Button variant="primary" onClick={handleSave}>Kaydet</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
