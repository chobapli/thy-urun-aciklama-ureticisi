import { useState, useRef } from 'react';
import { generateDescriptions } from '../lib/anthropic';
import type { Product, Category } from '../types';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useGenerate(
  products: Product[],
  categories: Category[],
  updateProduct: (id: string, updates: Partial<Product>) => void
) {
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
  const cancelRef = useRef(false);

  const getCatName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || 'Genel';
  const getSubName = (catId: string, subId: string) =>
    categories.find((c) => c.id === catId)?.subs.find((s) => s.id === subId)?.name || 'Genel';

  const generateOne = async (product: Product): Promise<void> => {
    updateProduct(product.id, { status: 'generating' });
    try {
      const result = await generateDescriptions(
        product.name,
        getCatName(product.catId),
        getSubName(product.catId, product.subId),
        product.code,
        product.imageUrls?.length ? product.imageUrls : undefined
      );
      updateProduct(product.id, { status: 'done', descTR: result.tr, descEN: result.en });
    } catch {
      updateProduct(product.id, { status: 'error' });
    }
  };

  const generateBatch = async () => {
    const targets = products.filter(
      (p) => p.status === 'pending' || p.status === 'error'
    );
    if (targets.length === 0) return;

    setBatchRunning(true);
    cancelRef.current = false;
    setBatchProgress({ done: 0, total: targets.length });

    for (let i = 0; i < targets.length; i++) {
      if (cancelRef.current) break;
      await generateOne(targets[i]);
      setBatchProgress({ done: i + 1, total: targets.length });
      if (i < targets.length - 1) await sleep(600);
    }

    setBatchRunning(false);
  };

  const cancelBatch = () => {
    cancelRef.current = true;
  };

  return { generateOne, generateBatch, cancelBatch, batchRunning, batchProgress };
}
