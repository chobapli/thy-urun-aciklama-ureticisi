import { useState } from 'react';
import type { Category, Product } from '../../types';
import { ProductForm } from '../Sidebar/ProductForm';
import { CsvUpload } from '../Sidebar/CsvUpload';
import { CategoryManager } from '../Sidebar/CategoryManager';
import { BatchGenerate } from '../Sidebar/BatchGenerate';

type Section = 'csv' | 'product' | 'category' | 'batch';

interface SidebarProps {
  categories: Category[];
  products: Product[];
  batchRunning: boolean;
  onAddProduct: (data: Omit<Product, 'id' | 'status' | 'descTR' | 'descEN'>) => void;
  onAddProducts: (items: Partial<Product>[]) => void;
  onBatchGenerate: () => void;
  onBatchCancel: () => void;
  catActions: {
    addCategory: (name: string) => void;
    renameCategory: (catId: string, name: string) => void;
    deleteCategory: (catId: string) => void;
    addSubcategory: (catId: string, name: string) => void;
    renameSubcategory: (catId: string, subId: string, name: string) => void;
    deleteSubcategory: (catId: string, subId: string) => void;
  };
}

interface SectionHeaderProps {
  label: string;
  section: Section;
  active: Section;
  onToggle: (s: Section) => void;
}

function SectionHeader({ label, section, active, onToggle }: SectionHeaderProps) {
  return (
    <button
      onClick={() => onToggle(section)}
      className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm font-medium transition-colors ${
        active === section
          ? 'text-text-main bg-[#ffffff06]'
          : 'text-text-secondary hover:text-text-main hover:bg-[#ffffff04]'
      }`}
    >
      <span>{label}</span>
      <span className="text-text-secondary">{active === section ? '▲' : '▼'}</span>
    </button>
  );
}

export function Sidebar({
  categories,
  products,
  batchRunning,
  onAddProduct,
  onAddProducts,
  onBatchGenerate,
  onBatchCancel,
  catActions,
}: SidebarProps) {
  const [activeSection, setActiveSection] = useState<Section>('product');

  const toggle = (s: Section) => setActiveSection((prev) => (prev === s ? 'product' : s));

  return (
    <aside
      style={{ width: 310, minWidth: 310, backgroundColor: '#161616' }}
      className="border-r border-border flex flex-col overflow-y-auto"
    >
      {/* Toplu Üretim */}
      <div className="border-b border-border">
        <SectionHeader label="⚡ Toplu Üretim" section="batch" active={activeSection} onToggle={toggle} />
        {activeSection === 'batch' && (
          <div className="px-4 pb-4">
            <BatchGenerate
              products={products}
              running={batchRunning}
              onGenerate={onBatchGenerate}
              onCancel={onBatchCancel}
            />
          </div>
        )}
      </div>

      {/* CSV Yükle */}
      <div className="border-b border-border">
        <SectionHeader label="📊 CSV Yükle" section="csv" active={activeSection} onToggle={toggle} />
        {activeSection === 'csv' && (
          <div className="px-4 pb-4">
            <CsvUpload categories={categories} onAdd={onAddProducts} />
          </div>
        )}
      </div>

      {/* Tek Ürün Ekle */}
      <div className="border-b border-border">
        <SectionHeader label="➕ Ürün Ekle" section="product" active={activeSection} onToggle={toggle} />
        {activeSection === 'product' && (
          <div className="px-4 pb-4">
            <ProductForm categories={categories} onAdd={onAddProduct} />
          </div>
        )}
      </div>

      {/* Kategori Yönetimi */}
      <div className="border-b border-border flex-1">
        <SectionHeader label="🗂 Kategori Yönetimi" section="category" active={activeSection} onToggle={toggle} />
        {activeSection === 'category' && (
          <div className="px-4 pb-4">
            <CategoryManager
              categories={categories}
              onAddCategory={catActions.addCategory}
              onRenameCategory={catActions.renameCategory}
              onDeleteCategory={catActions.deleteCategory}
              onAddSub={catActions.addSubcategory}
              onRenameSub={catActions.renameSubcategory}
              onDeleteSub={catActions.deleteSubcategory}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
