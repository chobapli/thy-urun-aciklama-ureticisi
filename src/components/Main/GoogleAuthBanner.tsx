import { Button } from '../UI/Button';

interface GoogleAuthBannerProps {
  token: string | null;
  userEmail: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function GoogleAuthBanner({ token, userEmail, onConnect, onDisconnect }: GoogleAuthBannerProps) {
  if (token) {
    return (
      <div className="bg-[#4ade8011] border border-[#4ade8033] rounded-lg px-4 py-3 flex items-center justify-between mb-4">
        <span className="text-success text-sm">
          ✓ Google Sheets'e bağlı{userEmail ? ` — ${userEmail}` : ''}
        </span>
        <Button variant="ghost" size="sm" onClick={onDisconnect}>
          Bağlantıyı Kes
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#6a9cf811] border border-[#6a9cf833] rounded-lg px-4 py-3 flex items-center justify-between mb-4">
      <span className="text-[#6a9cf8] text-sm">
        Google Sheets'e export için bağlanın
      </span>
      <Button variant="secondary" size="sm" onClick={onConnect}>
        Google ile Bağlan
      </Button>
    </div>
  );
}
