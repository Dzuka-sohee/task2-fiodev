const attendanceData = [
  { name: "Andi Pratama", department: "Engineering", clockIn: "08:00", clockOut: "17:05", status: "Hadir", duration: "9j 5m" },
  { name: "Siti Rahmawati", department: "Marketing", clockIn: "08:15", clockOut: "17:00", status: "Hadir", duration: "8j 45m" },
  { name: "Budi Santoso", department: "Finance", clockIn: "08:45", clockOut: "17:10", status: "Terlambat", duration: "8j 25m" },
  { name: "Dewi Lestari", department: "HR", clockIn: "07:55", clockOut: "17:30", status: "Hadir", duration: "9j 35m" },
  { name: "Rizki Firmansyah", department: "Engineering", clockIn: "-", clockOut: "-", status: "Cuti", duration: "-" },
  { name: "Maya Putri", department: "Marketing", clockIn: "08:02", clockOut: "16:45", status: "Hadir", duration: "8j 43m" },
  { name: "Arif Hidayat", department: "Operations", clockIn: "09:10", clockOut: "17:20", status: "Terlambat", duration: "8j 10m" },
  { name: "Rina Wati", department: "Finance", clockIn: "08:00", clockOut: "-", status: "Aktif", duration: "-" },
];

const statusStyles: Record<string, string> = {
  Hadir: "bg-green-500/10 text-green-700 border border-green-500/20",
  Terlambat: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
  Cuti: "bg-blue-500/10 text-blue-700 border border-blue-500/20",
  Aktif: "bg-green-500/10 text-green-700 border border-green-500/20",
};

const glassStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  backdropFilter: "blur(12px) saturate(150%)",
  WebkitBackdropFilter: "blur(12px) saturate(150%)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)",
};

export default function AttendanceTable() {
  return (
    <div className="rounded-2xl overflow-hidden" style={glassStyle}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
        <h3 className="text-[20px] font-semibold text-primary">Absensi Hari Ini</h3>
        <button className="text-[12px] font-semibold text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-xl hover:bg-surface-variant/30">
          Lihat Semua
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
              <th className="text-left px-6 py-3 text-[12px] font-semibold text-secondary uppercase tracking-widest">Nama</th>
              <th className="text-left px-6 py-3 text-[12px] font-semibold text-secondary uppercase tracking-widest">Departemen</th>
              <th className="text-left px-6 py-3 text-[12px] font-semibold text-secondary uppercase tracking-widest">Masuk</th>
              <th className="text-left px-6 py-3 text-[12px] font-semibold text-secondary uppercase tracking-widest">Keluar</th>
              <th className="text-left px-6 py-3 text-[12px] font-semibold text-secondary uppercase tracking-widest">Durasi</th>
              <th className="text-left px-6 py-3 text-[12px] font-semibold text-secondary uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((row, i) => (
              <tr key={i} className="hover:bg-surface-variant/20 transition-colors" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.04)" }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                      <span className="text-on-secondary-container text-xs font-bold">
                        {row.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-primary">{row.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] text-secondary">{row.department}</td>
                <td className="px-6 py-4 text-[14px] text-primary font-mono">{row.clockIn}</td>
                <td className="px-6 py-4 text-[14px] text-primary font-mono">{row.clockOut}</td>
                <td className="px-6 py-4 text-[14px] text-secondary">{row.duration}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${statusStyles[row.status] || "bg-surface-container text-secondary"}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
