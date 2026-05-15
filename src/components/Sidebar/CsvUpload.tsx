import { useRef, useState } from 'react';
import type { Category, Product } from '../../types';
import { parseCSV } from '../../lib/csv';
import { Button } from '../UI/Button';

interface CsvUploadProps {
  categories: Category[];
  onAdd: (items: Partial<Product>[]) => void;
}

export function CsvUpload({ categories, onAdd }: CsvUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<Partial<Product>[] | null>(null);

  const process = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const items = parseCSV(text, categories);
      setPreview(items);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) process(file);
  };

  const handleConfirm = () => {
    if (preview) {
      onAdd(preview);
      setPreview(null);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div>
          <p className="text-text-secondary text-xs mb-2">
            {preview.length} ürün bulundu. Eklensin mi?
          </p>
          <div className="max-h-32 overflow-y-auto space-y-1 mb-3">
            {preview.slice(0, 5).map((p, i) => (
              <div key={i} className="text-text-main text-xs bg-bg rounded px-2 py-1">
                {p.name}
              </div>
            ))}
            {preview.length > 5 && (
              <div className="text-text-secondary text-xs px-2">
                +{preview.length - 5} daha...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={handleConfirm}>Ekle</Button>
            <Button size="sm" variant="ghost" onClick={() => setPreview(null)}>İptal</Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragging ? 'border-header bg-[#C8102E11]' : 'border-border hover:border-[#444]'
          }`}
        >
          <div className="text-2xl mb-1">📊</div>
          <p className="text-text-secondary text-xs">
            CSV sürükle & bırak<br />veya tıkla
          </p>
          <p className="text-text-secondary text-xs mt-1 opacity-60">
            kod, kategori, alt_kategori, ad
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) process(file);
            }}
          />
        </div>
      )}
    </div>
  );
}
