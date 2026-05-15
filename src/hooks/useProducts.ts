import { useState, useEffect } from 'react';
import type { Product } from '../types';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('products', JSON.stringify(products));
    }, 300);
    return () => clearTimeout(timer);
  }, [products]);

  const addProduct = (data: Omit<Product, 'id' | 'status' | 'descTR' | 'descEN'>) => {
    const product: Product = {
      ...data,
      id: uid(),
      status: 'pending',
      descTR: '',
      descEN: '',
    };
    setProducts((prev) => [...prev, product]);
    return product;
  };

  const addProducts = (items: Partial<Product>[]) => {
    const newProducts: Product[] = items
      .filter((item) => item.name)
      .map((item) => ({
        id: uid(),
        code: item.code || '',
        name: item.name || '',
        catId: item.catId || '',
        subId: item.subId || '',
        imageUrl: item.imageUrl || '',
        status: 'pending' as const,
        descTR: '',
        descEN: '',
      }));
    setProducts((prev) => [...prev, ...newProducts]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return { products, addProduct, addProducts, updateProduct, deleteProduct };
}
