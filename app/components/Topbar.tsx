"use client";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <header
      className="sticky top-0 w-full z-40 flex justify-between items-center h-16 px-6 lg:px-10"
      style={{
        backgroundColor: "rgba(234, 232, 231, 0.4)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "none",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
      }}
    >
      <h1 className="text-[20px] font-black text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:bg-white/40 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-[1px]" style={{ backgroundColor: "rgba(0, 0, 0, 0.08)" }} />
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary">Fingerspot HQ</p>
            <p className="text-[10px] text-secondary uppercase tracking-tight">Main Server</p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <span className="material-symbols-outlined text-primary">business</span>
          </div>
        </div>
      </div>
    </header>
  );
}
