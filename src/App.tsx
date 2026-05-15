import { useState, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { StatsBar } from './components/Main/StatsBar';
import { BatchProgress } from './components/Main/BatchProgress';
import { ProductTable } from './components/Main/ProductTable';
import { SearchBar } from './components/Main/SearchBar';
import { ProductModal } from './components/Modals/ProductModal';
import { ToastContainer } from './components/UI/Toast';
import { useProducts } from './hooks/useProducts';
import { useCategories } from './hooks/useCategories';
import { useGenerate } from './hooks/useGenerate';
import { exportCSV } from './lib/csv';
import type { Product, ToastMessage } from './types';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function App() {
  const { products, addProduct, addProducts, updateProduct, deleteProduct } = useProducts();
  const {
    categories,
    addCategory,
    renameCategory,
    deleteCategory,
    addSubcategory,
    renameSubcategory,
    deleteSubcategory,
  } = useCategories();
  const { generateOne, generateBatch, cancelBatch, batchRunning, batchProgress } = useGenerate(
    products,
    categories,
    updateProduct
  );
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const catName = categories.find((c) => c.id === p.catId)?.name.toLowerCase() || '';
    const subName =
      categories.find((c) => c.id === p.catId)?.subs.find((s) => s.id === p.subId)?.name.toLowerCase() || '';
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      catName.includes(q) ||
      subName.includes(q)
    );
  });

  const handleModalGenerate = async (product: Product) => {
    await generateOne(product);
    const updated = products.find((p) => p.id === product.id);
    if (updated) setEditingProduct({ ...updated });
    addToast('Açıklama üretildi', 'success');
  };

  return (
    <div
      style={{ backgroundColor: '#0D0D0D', color: '#FAFAF8', fontFamily: 'system-ui, sans-serif' }}
      className="min-h-screen flex flex-col"
    >
      <Header />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        <Sidebar
          categories={categories}
          products={products}
          batchRunning={batchRunning}
          onAddProduct={(data) => {
            addProduct(data);
            addToast('Ürün eklendi', 'success');
          }}
          onAddProducts={(items) => {
            addProducts(items);
            addToast(`${items.length} ürün CSV'den eklendi`, 'success');
          }}
          onBatchGenerate={generateBatch}
          onBatchCancel={cancelBatch}
          catActions={{
            addCategory,
            renameCategory,
            deleteCategory,
            addSubcategory,
            renameSubcategory,
            deleteSubcategory,
          }}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-text-main text-xl font-bold">Ürün Açıklamaları</h1>
              <p className="text-text-secondary text-sm mt-0.5">
                {products.length} ürün • {products.filter((p) => p.status === 'done').length} tamamlandı
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportCSV(products, categories)}
                className="bg-[#222] border border-border text-text-secondary hover:text-text-main text-sm px-4 py-2 rounded-lg transition-colors"
              >
                📥 CSV İndir
              </button>
            </div>
          </div>

          <StatsBar products={products} />

          <BatchProgress
            running={batchRunning}
            progress={batchProgress}
            onCancel={cancelBatch}
          />

          <SearchBar value={search} onChange={setSearch} />

          <ProductTable
            products={filteredProducts}
            categories={categories}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={(id) => {
              deleteProduct(id);
              addToast('Ürün silindi', 'info');
            }}
          />
        </main>
      </div>

      {editingProduct && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={(updates) => {
            updateProduct(editingProduct.id, updates);
            setEditingProduct((prev) => prev ? { ...prev, ...updates } : null);
          }}
          onGenerate={handleModalGenerate}
          onClose={() => setEditingProduct(null)}
        />
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
