interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cat' | 'subcat';
}

export function Badge({ children, variant = 'cat' }: BadgeProps) {
  const color = variant === 'cat' ? '#e05a78' : '#6a9cf8';
  return (
    <span
      style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
      className="text-xs px-2 py-0.5 rounded-full font-medium"
    >
      {children}
    </span>
  );
}
