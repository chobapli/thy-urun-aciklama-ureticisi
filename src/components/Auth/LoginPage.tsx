import { useState, type FormEvent } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  error: string;
}

export function LoginPage({ onLogin, error }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onLogin(username, password);
    setSubmitting(false);
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0D0D0D' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a' }}
      >
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ backgroundColor: '#C41E3A' }}
          >
            <span className="text-white font-bold text-lg">TK</span>
          </div>
          <h1 className="text-white text-xl font-semibold">TK Store İçerik</h1>
          <p className="text-sm mt-1" style={{ color: '#6b6b6b' }}>
            Devam etmek için giriş yapın
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: '#6b6b6b' }}
            >
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
              style={{
                backgroundColor: '#0D0D0D',
                border: '1px solid #2a2a2a',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#444')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: '#6b6b6b' }}
            >
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
              style={{
                backgroundColor: '#0D0D0D',
                border: '1px solid #2a2a2a',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#444')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: '#ef4444' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-opacity"
            style={{
              backgroundColor: '#C41E3A',
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
