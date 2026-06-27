const glassStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  backdropFilter: "blur(12px) saturate(150%)",
  WebkitBackdropFilter: "blur(12px) saturate(150%)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)",
};

export default function AttendanceChart() {
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const hadir = [85, 92, 78, 88, 95, 45, 12];
  const terlambat = [8, 5, 12, 7, 3, 2, 0];
  const maxVal = 100;

  return (
    <div className="rounded-2xl p-6" style={glassStyle}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-semibold text-primary">Statistik Mingguan</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[12px] font-semibold text-secondary">Hadir</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[12px] font-semibold text-secondary">Terlambat</span>
          </div>
        </div>
      </div>
      <div className="flex items-end gap-3 h-48">
        {days.map((day, i) => (
          <div key={day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "160px" }}>
              <div
                className="w-full rounded-t-sm"
                style={{ height: `${(hadir[i] / maxVal) * 100}%`, backgroundColor: "rgba(29, 43, 62, 0.7)" }}
              />
              <div
                className="w-full rounded-b-sm"
                style={{ height: `${(terlambat[i] / maxVal) * 20}%`, backgroundColor: "rgba(245, 158, 11, 0.7)" }}
              />
            </div>
            <span className="text-[12px] font-semibold text-secondary">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
