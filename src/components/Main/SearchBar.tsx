interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">🔍</span>
      <input
        type="text"
        placeholder="Ad, kod veya kategori ile ara..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-sidebar border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary focus:outline-none focus:border-[#444]"
      />
    </div>
  );
}
