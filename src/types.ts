export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subs: Subcategory[];
}

export interface Product {
  id: string;
  code: string;
  catId: string;
  subId: string;
  name: string;
  imageUrls: string[];
  extraInfo?: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  descTR: string;
  descEN: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
