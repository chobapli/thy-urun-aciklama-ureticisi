import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Kullanıcı adı → Firebase email eşlemesi (şifre burada yok, güvenli)
const USERNAME_MAP: Record<string, string> = {
  cenk: 'cenk@tk-store-icerik.app',
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (username: string, password: string) => {
    setError('');
    const email = USERNAME_MAP[username.toLowerCase()];
    if (!email) {
      setError('Kullanıcı adı veya şifre hatalı.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Kullanıcı adı veya şifre hatalı.');
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, error, login, logout };
}
