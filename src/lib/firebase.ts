import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: 'tk-store-icerik',
  appId: '1:200292674211:web:695175f2f18753e89ead16',
  storageBucket: 'tk-store-icerik.firebasestorage.app',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'tk-store-icerik.firebaseapp.com',
  messagingSenderId: '200292674211',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
