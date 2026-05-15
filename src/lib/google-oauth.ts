const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient: google.accounts.oauth2.TokenClient | null = null;

declare global {
  interface Window {
    google: typeof google;
  }
}

export function initGoogleAuth(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export function requestAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (response) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.access_token);
          }
        },
      });
    }
    tokenClient.requestAccessToken({ prompt: '' });
  });
}

export function saveToken(token: string) {
  localStorage.setItem('google_token', token);
  localStorage.setItem('google_token_time', Date.now().toString());
}

export function loadToken(): string | null {
  const token = localStorage.getItem('google_token');
  const time = localStorage.getItem('google_token_time');
  if (!token || !time) return null;
  // Token 55 dakikadan eskiyse geçersiz say
  if (Date.now() - parseInt(time) > 55 * 60 * 1000) {
    clearToken();
    return null;
  }
  return token;
}

export function clearToken() {
  localStorage.removeItem('google_token');
  localStorage.removeItem('google_token_time');
}
