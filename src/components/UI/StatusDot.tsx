import type { Product } from '../../types';

const config = {
  pending: { color: '#666', label: 'Bekliyor', animate: false },
  generating: { color: '#f0a832', label: 'Üretiliyor', animate: true },
  done: { color: '#4ade80', label: 'Tamamlandı', animate: false },
  error: { color: '#ff6b80', label: 'Hata', animate: false },
};

export function StatusDot({ status }: { status: Product['status'] }) {
  const { color, label, animate } = config[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        style={{ backgroundColor: color }}
        className={`w-2 h-2 rounded-full ${animate ? 'animate-pulse' : ''}`}
      />
      <span style={{ color }} className="text-xs font-medium">{label}</span>
    </span>
  );
}
