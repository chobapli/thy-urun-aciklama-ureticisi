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
  const [extraInfo, setExtraInfo] = useState(product.extraInfo ?? '');
  const [techSpecs, setTechSpecs] = useState(product.techSpecs ?? '');
  const [generating, setGenerating] = useState(false);

  const catName = categories.find((c) => c.id === product.catId)?.name || '';
  const subName = categories.find((c) => c.id === product.catId)?.subs.find((s) => s.id === product.subId)?.name || '';

  const handleGenerate = async () => {
    setGenerating(true);
    const extra = extraInfo.trim() || undefined;
    const specs = techSpecs.trim() || undefined;
    try {
      await onGenerate({ ...product, descTR, descEN, extraInfo: extra, techSpecs: specs });
      onSave({ descTR, descEN, extraInfo: extra, techSpecs: specs });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({ descTR, descEN, extraInfo: extraInfo.trim() || undefined, techSpecs: techSpecs.trim() || undefined });
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
            <div className="flex items-start gap-3 flex-1">
              {product.imageUrls?.length > 0 && (
                <div className="flex gap-1.5 shrink-0">
                  {product.imageUrls.slice(0, 4).map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Görsel ${idx + 1}`}
                      className="w-12 h-12 rounded-lg object-cover border border-border"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ))}
                </div>
              )}
              <div>
                <h2 className="text-text-main font-bold text-lg">{product.name}</h2>
                <p className="text-text-secondary text-xs mt-1 font-mono">
                  {product.code}
                  {catName && ` • ${catName}`}
                  {subName && ` › ${subName}`}
                </p>
              </div>
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
        <div className="p-6 space-y-4">
          <div>
            <label className="text-text-secondary text-xs font-medium uppercase tracking-wide block mb-1">
              Ekstra Bilgi <span className="text-text-secondary font-normal normal-case">(opsiyonel)</span>
            </label>
            <textarea
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              placeholder="Açıklamayı yönlendirmek için ek bağlam..."
              rows={2}
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-main text-sm resize-none focus:outline-none focus:border-[#444] placeholder:text-text-secondary"
            />
          </div>

          <div>
            <label className="text-text-secondary text-xs font-medium uppercase tracking-wide block mb-1">
              Teknik Özellikler <span className="text-text-secondary font-normal normal-case">(opsiyonel)</span>
            </label>
            <textarea
              value={techSpecs}
              onChange={(e) => setTechSpecs(e.target.value)}
              placeholder="Malzeme, boyut, ağırlık, kapasite..."
              rows={2}
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-main text-sm resize-none focus:outline-none focus:border-[#444] placeholder:text-text-secondary"
            />
          </div>

          <div>
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
