import { useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export function ImageUpload({ imageUrl, onImageChange }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const isUrl = imageUrl.startsWith('http');

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const path = `products/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onImageChange(url);
    } catch {
      alert('Görsel yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-text-secondary text-xs font-medium uppercase tracking-wide">Görsel</label>

      {imageUrl ? (
        <div className="relative inline-block w-full">
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
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border border-dashed border-border rounded-lg py-3 text-text-secondary text-sm hover:border-[#444] hover:text-text-main transition-colors disabled:opacity-50"
          >
            {uploading ? '⏳ Yükleniyor...' : '📁 Bilgisayardan Yükle'}
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

          {!isUrl && (
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
