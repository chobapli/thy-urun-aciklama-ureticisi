export function Header() {
  return (
    <header
      style={{ backgroundColor: '#C8102E', height: 56 }}
      className="flex items-center justify-between px-6 shrink-0 shadow-lg"
    >
      <div className="flex items-center gap-3">
        {/* THY Logo placeholder */}
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-header text-xs font-black">TK</span>
        </div>
        <span className="text-white font-bold text-sm tracking-wide">
          Turkish Airlines — Ürün İçerik Üreticisi
        </span>
      </div>
      <span className="text-white/70 text-sm italic font-light tracking-widest">
        Widen Your World
      </span>
    </header>
  );
}
