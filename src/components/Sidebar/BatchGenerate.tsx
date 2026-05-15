import type { Product } from '../../types';
import { Button } from '../UI/Button';

interface BatchGenerateProps {
  products: Product[];
  running: boolean;
  onGenerate: () => void;
  onCancel: () => void;
}

export function BatchGenerate({ products, running, onGenerate, onCancel }: BatchGenerateProps) {
  const pendingCount = products.filter(
    (p) => p.status === 'pending' || p.status === 'error'
  ).length;

  return (
    <div className="space-y-2">
      {running ? (
        <Button variant="danger" className="w-full" onClick={onCancel}>
          ⏹ Durdur
        </Button>
      ) : (
        <Button
          variant="primary"
          className="w-full"
          onClick={onGenerate}
          disabled={pendingCount === 0}
        >
          ⚡ Tümünü Üret {pendingCount > 0 && `(${pendingCount})`}
        </Button>
      )}
      {pendingCount === 0 && !running && (
        <p className="text-text-secondary text-xs text-center">
          Üretilecek ürün yok
        </p>
      )}
    </div>
  );
}
