interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}

export default function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-secondary",
  }[changeType];

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-3"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(12px) saturate(150%)",
        WebkitBackdropFilter: "blur(12px) saturate(150%)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center">
          <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-[40px] font-bold text-primary leading-none tracking-tight">{value}</span>
        <span className={`text-[12px] font-semibold ${changeColor} mb-1`}>{change}</span>
      </div>
    </div>
  );
}
