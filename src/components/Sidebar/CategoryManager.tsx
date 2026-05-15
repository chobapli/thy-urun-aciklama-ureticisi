import { useState } from 'react';
import type { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onRenameCategory: (catId: string, name: string) => void;
  onDeleteCategory: (catId: string) => void;
  onAddSub: (catId: string, name: string) => void;
  onRenameSub: (catId: string, subId: string, name: string) => void;
  onDeleteSub: (catId: string, subId: string) => void;
}

function InlineEdit({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value);

  if (!editing) {
    return (
      <span
        className="cursor-pointer hover:text-text-main transition-colors"
        onDoubleClick={() => setEditing(true)}
        title="Çift tıklayarak düzenle"
      >
        {value}
      </span>
    );
  }

  return (
    <input
      autoFocus
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => { onSave(v); setEditing(false); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { onSave(v); setEditing(false); }
        if (e.key === 'Escape') { setV(value); setEditing(false); }
      }}
      className="bg-bg border border-border rounded px-1 py-0.5 text-xs text-text-main focus:outline-none w-full"
    />
  );
}

export function CategoryManager({
  categories,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onAddSub,
  onRenameSub,
  onDeleteSub,
}: CategoryManagerProps) {
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());
  const [newCatName, setNewCatName] = useState('');
  const [newSubNames, setNewSubNames] = useState<Record<string, string>>({});

  const toggle = (catId: string) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <div key={cat.id} className="bg-bg border border-border rounded-lg overflow-hidden">
          {/* Ana kategori satırı */}
          <div
            className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#ffffff04]"
            onClick={() => toggle(cat.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 text-sm">
              <span className="text-text-secondary text-xs">{openCats.has(cat.id) ? '▼' : '▶'}</span>
              <span
                className="text-text-main font-medium flex-1 min-w-0"
                onClick={(e) => e.stopPropagation()}
              >
                <InlineEdit
                  value={cat.name}
                  onSave={(name) => onRenameCategory(cat.id, name)}
                />
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }}
              className="text-text-secondary hover:text-error-color text-xs ml-2 shrink-0"
              title="Kategoriyi sil"
            >
              ×
            </button>
          </div>

          {/* Alt kategoriler */}
          {openCats.has(cat.id) && (
            <div className="border-t border-border px-3 py-2 space-y-1.5">
              {cat.subs.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2 pl-3">
                  <span className="text-text-secondary text-xs">—</span>
                  <span className="text-text-secondary text-xs flex-1 min-w-0">
                    <InlineEdit
                      value={sub.name}
                      onSave={(name) => onRenameSub(cat.id, sub.id, name)}
                    />
                  </span>
                  <button
                    onClick={() => onDeleteSub(cat.id, sub.id)}
                    className="text-text-secondary hover:text-error-color text-xs shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Alt kategori ekle */}
              <div className="flex gap-1 pl-3 mt-2">
                <input
                  type="text"
                  placeholder="Alt kategori ekle..."
                  value={newSubNames[cat.id] || ''}
                  onChange={(e) => setNewSubNames((p) => ({ ...p, [cat.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSubNames[cat.id]?.trim()) {
                      onAddSub(cat.id, newSubNames[cat.id].trim());
                      setNewSubNames((p) => ({ ...p, [cat.id]: '' }));
                    }
                  }}
                  className="flex-1 bg-sidebar border border-border rounded px-2 py-1 text-xs text-text-main placeholder:text-text-secondary focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (newSubNames[cat.id]?.trim()) {
                      onAddSub(cat.id, newSubNames[cat.id].trim());
                      setNewSubNames((p) => ({ ...p, [cat.id]: '' }));
                    }
                  }}
                  className="bg-[#222] text-text-secondary hover:text-text-main text-xs px-2 rounded border border-border"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Yeni ana kategori */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Yeni kategori..."
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newCatName.trim()) {
              onAddCategory(newCatName.trim());
              setNewCatName('');
            }
          }}
          className="flex-1 bg-bg border border-border rounded-lg px-3 py-1.5 text-xs text-text-main placeholder:text-text-secondary focus:outline-none"
        />
        <button
          onClick={() => {
            if (newCatName.trim()) {
              onAddCategory(newCatName.trim());
              setNewCatName('');
            }
          }}
          className="bg-[#222] text-text-secondary hover:text-text-main text-sm px-3 rounded-lg border border-border"
        >
          +
        </button>
      </div>
    </div>
  );
}
