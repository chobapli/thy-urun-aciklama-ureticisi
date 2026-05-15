import type { Product } from '../../types';

interface StatsBarProps {
  products: Product[];
}

export function StatsBar({ products }: StatsBarProps) {
  const total = products.length;
  const done = products.filter((p) => p.status === 'done').length;
  const pending = products.filter((p) => p.status === 'pending').length;
  const error = products.filter((p) => p.status === 'error').length;

  const cards = [
    { label: 'Toplam', value: total, color: '#FAFAF8' },
    { label: 'Tamamlandı', value: done, color: '#4ade80' },
    { label: 'Bekliyor', value: pending, color: '#f0a832' },
    { label: 'Hata', value: error, color: '#ff6b80' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-sidebar border border-border rounded-lg p-4"
        >
          <div style={{ color: card.color }} className="text-2xl font-bold">
            {card.value}
          </div>
          <div className="text-text-secondary text-xs mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
