import type { Product, Category } from '../../types';
import { Badge } from '../UI/Badge';
import { StatusDot } from '../UI/StatusDot';

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({ products, categories, onEdit, onDelete }: ProductTableProps) {
  const getCatName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || '';
  const getSubName = (catId: string, subId: string) =>
    categories.find((c) => c.id === catId)?.subs.find((s) => s.id === subId)?.name || '';

  if (products.length === 0) {
    return (
      <div className="bg-sidebar border border-border rounded-lg flex items-center justify-center h-48">
        <span className="text-text-secondary text-sm">
          Henüz ürün yok. Sol panelden ürün ekleyin.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-sidebar border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-text-secondary font-medium px-4 py-3">Ürün</th>
            <th className="text-left text-text-secondary font-medium px-4 py-3">Kategori</th>
            <th className="text-left text-text-secondary font-medium px-4 py-3">Durum</th>
            <th className="text-left text-text-secondary font-medium px-4 py-3">Türkçe Açıklama</th>
            <th className="text-left text-text-secondary font-medium px-4 py-3">İngilizce Açıklama</th>
            <th className="text-right text-text-secondary font-medium px-4 py-3">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr
              key={product.id}
              className={`border-b border-border last:border-0 hover:bg-[#ffffff04] transition-colors ${
                idx % 2 === 0 ? '' : 'bg-[#ffffff02]'
              }`}
            >
              {/* Ürün */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 flex gap-1">
                    {product.imageUrls?.length > 0 ? (
                      <>
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="w-9 h-9 rounded object-cover border border-border"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        {product.imageUrls.length > 1 && (
                          <span className="w-9 h-9 rounded bg-border flex items-center justify-center text-text-secondary text-xs font-medium">
                            +{product.imageUrls.length - 1}
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="w-9 h-9 rounded bg-border flex items-center justify-center text-text-secondary text-xs">
                        📦
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-text-main font-medium leading-tight">{product.name}</div>
                    <div className="text-text-secondary font-mono text-xs mt-0.5">{product.code}</div>
                  </div>
                </div>
              </td>
              {/* Kategori */}
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  {getCatName(product.catId) && (
                    <Badge variant="cat">{getCatName(product.catId)}</Badge>
                  )}
                  {getSubName(product.catId, product.subId) && (
                    <Badge variant="subcat">{getSubName(product.catId, product.subId)}</Badge>
                  )}
                </div>
              </td>
              {/* Durum */}
              <td className="px-4 py-3">
                <StatusDot status={product.status} />
              </td>
              {/* TR Açıklama */}
              <td className="px-4 py-3" style={{ maxWidth: '320px' }}>
                <p className="text-text-secondary text-xs leading-relaxed whitespace-normal">
                  {product.descTR || '—'}
                </p>
              </td>
              {/* EN Açıklama */}
              <td className="px-4 py-3" style={{ maxWidth: '320px' }}>
                <p className="text-text-secondary text-xs leading-relaxed whitespace-normal">
                  {product.descEN || '—'}
                </p>
              </td>
              {/* İşlem */}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(product)}
                    title="Düzenle / Üret"
                    className="w-7 h-7 rounded hover:bg-[#ffffff0a] text-text-secondary hover:text-text-main transition-colors text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    title="Sil"
                    className="w-7 h-7 rounded hover:bg-[#ff6b8022] text-text-secondary hover:text-error-color transition-colors text-sm"
                  >
                    ×
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
