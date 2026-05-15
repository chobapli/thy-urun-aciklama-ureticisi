import { useState, useEffect } from 'react';
import { initGoogleAuth, requestAccessToken, saveToken, loadToken, clearToken } from '../lib/google-oauth';
import { exportToSheets } from '../lib/sheets';
import type { Product, Category } from '../types';

export function useGoogle() {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    initGoogleAuth().then(() => {
      const saved = loadToken();
      if (saved) setToken(saved);
    });
  }, []);

  const connect = async () => {
    await initGoogleAuth();
    try {
      const accessToken = await requestAccessToken();
      saveToken(accessToken);
      setToken(accessToken);
      // Email bilgisini al
      const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await resp.json();
      setUserEmail(data.email || null);
    } catch (e) {
      console.error('Google OAuth hatası:', e);
      throw e;
    }
  };

  const disconnect = () => {
    clearToken();
    setToken(null);
    setUserEmail(null);
  };

  const doExport = async (products: Product[], categories: Category[]) => {
    if (!token) throw new Error('Bağlı değil');
    setExporting(true);
    try {
      await exportToSheets(products, categories, token);
    } catch (err: unknown) {
      const e = err as { status?: number };
      if (e?.status === 401) {
        disconnect();
        throw new Error('Token süresi doldu, lütfen yeniden bağlanın');
      }
      throw err;
    } finally {
      setExporting(false);
    }
  };

  return { token, userEmail, exporting, connect, disconnect, doExport };
}
