import { useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

interface ImageUploadProps {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
}

export function ImageUpload({ imageUrls, onImagesChange }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );
      onImagesChange([...imageUrls, ...uploaded]);
    } catch {
      alert('Görsel yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlAdd = () => {
    const trimmed = urlInput.trim();
    if (!trimmed || !trimmed.startsWith('http')) return;
    onImagesChange([...imageUrls, trimmed]);
    setUrlInput('');
  };

  const removeImage = (idx: number) => {
    onImagesChange(imageUrls.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <label className="text-text-secondary text-xs font-medium uppercase tracking-wide">
        Görseller {imageUrls.length > 0 && <span className="text-text-main">({imageUrls.length})</span>}
      </label>

      {/* Yüklü görseller grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt={`Görsel ${idx + 1}`}
                className="w-full h-16 object-cover rounded-lg border border-border"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 text-white rounded-full text-xs items-center justify-center hidden group-hover:flex hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dosyadan ekle */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full border border-dashed border-border rounded-lg py-2.5 text-text-secondary text-sm hover:border-[#444] hover:text-text-main transition-colors disabled:opacity-50"
      >
        {uploading ? '⏳ Yükleniyor...' : '📁 Bilgisayardan Ekle'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); }}
      />

      {/* URL ile ekle */}
      <div className="flex gap-1.5">
        <input
          type="text"
          placeholder="Görsel URL ekle..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUrlAdd(); } }}
          className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-main placeholder:text-text-secondary focus:outline-none focus:border-[#444]"
        />
        <button
          type="button"
          onClick={handleUrlAdd}
          className="px-3 py-2 bg-[#222] border border-border rounded-lg text-text-secondary hover:text-text-main text-sm transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
