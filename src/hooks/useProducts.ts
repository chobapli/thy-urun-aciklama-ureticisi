import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product } from '../types';

const COL = 'products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore'dan gerçek zamanlı dinle
  useEffect(() => {
    const q = query(collection(db, COL), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  const addProduct = async (data: Omit<Product, 'id' | 'status' | 'descTR' | 'descEN'>) => {
    const docRef = await addDoc(collection(db, COL), {
      ...data,
      status: 'pending',
      descTR: '',
      descEN: '',
      createdAt: serverTimestamp(),
    });
    // Yerel state için geçici id — onSnapshot zaten güncelleyecek
    const product: Product = { id: docRef.id, ...data, status: 'pending', descTR: '', descEN: '' };
    return product;
  };

  const addProducts = async (items: Partial<Product>[]) => {
    const valids = items.filter((item) => item.name);
    await Promise.all(
      valids.map((item) =>
        addDoc(collection(db, COL), {
          code: item.code || '',
          name: item.name || '',
          catId: item.catId || '',
          subId: item.subId || '',
          imageUrl: item.imageUrl || '',
          status: 'pending',
          descTR: '',
          descEN: '',
          createdAt: serverTimestamp(),
        })
      )
    );
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Anlık UI güncellemesi (optimistic)
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    await updateDoc(doc(db, COL, id), updates);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, COL, id));
  };

  return { products, loading, addProduct, addProducts, updateProduct, deleteProduct };
}
