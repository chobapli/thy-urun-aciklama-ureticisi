import { Button } from '../UI/Button';

interface BatchProgressProps {
  running: boolean;
  progress: { done: number; total: number };
  onCancel: () => void;
}

export function BatchProgress({ running, progress, onCancel }: BatchProgressProps) {
  if (!running) return null;

  const pct = progress.total > 0 ? (progress.done / progress.total) * 100 : 0;

  return (
    <div className="bg-sidebar border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-main text-sm font-medium">
          Toplu Üretim — {progress.done} / {progress.total}
        </span>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Durdur
        </Button>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          style={{ width: `${pct}%`, backgroundColor: '#f0a832' }}
          className="h-full rounded-full transition-all duration-300"
        />
      </div>
    </div>
  );
}
