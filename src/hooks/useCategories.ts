import { useState, useEffect } from 'react';
import { DEFAULT_CATS } from '../constants';
import type { Category } from '../types';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATS;
    } catch {
      return DEFAULT_CATS;
    }
  });

  // Debounce ile kaydet
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('categories', JSON.stringify(categories));
    }, 300);
    return () => clearTimeout(timer);
  }, [categories]);

  const addCategory = (name: string) => {
    setCategories((prev) => [...prev, { id: `cat-${uid()}`, name, subs: [] }]);
  };

  const renameCategory = (catId: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, name } : c)));
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const addSubcategory = (catId: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, subs: [...c.subs, { id: `sub-${uid()}`, name }] }
          : c
      )
    );
  };

  const renameSubcategory = (catId: string, subId: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, subs: c.subs.map((s) => (s.id === subId ? { ...s, name } : s)) }
          : c
      )
    );
  };

  const deleteSubcategory = (catId: string, subId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, subs: c.subs.filter((s) => s.id !== subId) } : c
      )
    );
  };

  return {
    categories,
    addCategory,
    renameCategory,
    deleteCategory,
    addSubcategory,
    renameSubcategory,
    deleteSubcategory,
  };
}
