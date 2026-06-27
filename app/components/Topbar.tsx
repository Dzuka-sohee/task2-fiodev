"use client";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <header className="sticky top-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-on-surface/[0.08] shadow-[0px_10px_30px_rgba(51,65,85,0.05)] flex justify-between items-center h-16 px-6 lg:px-10">
      <h2 className="text-[20px] leading-[28px] font-semibold text-primary">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-colors">
          <span className="material-symbols-outlined text-secondary">notifications</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant/30"></div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">Admin Super</p>
            <p className="text-[12px] leading-4 text-secondary font-semibold" style={{ letterSpacing: "0.05em" }}>IT Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center border border-primary/10">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
