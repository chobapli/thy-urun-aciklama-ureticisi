import { useRef } from 'react';

interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export function ImageUpload({ imageUrl, onImageChange }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isBase64 = imageUrl.startsWith('data:');
  const isUrl = imageUrl.startsWith('http');

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-text-secondary text-xs font-medium uppercase tracking-wide">Görsel</label>

      {imageUrl ? (
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-border"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={() => onImageChange('')}
            className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full text-xs flex items-center justify-center hover:bg-black"
          >
            ×
          </button>
          {isBase64 && (
            <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
              Yüklendi
            </span>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Dosya yükle */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-border rounded-lg py-3 text-text-secondary text-sm hover:border-[#444] hover:text-text-main transition-colors"
          >
            📁 Bilgisayardan Yükle
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {/* URL gir */}
          {!isBase64 && (
            <input
              type="text"
              placeholder="veya görsel URL girin..."
              value={isUrl ? imageUrl : ''}
              onChange={(e) => onImageChange(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-main placeholder:text-text-secondary focus:outline-none focus:border-[#444]"
            />
          )}
        </div>
      )}
    </div>
  );
}
