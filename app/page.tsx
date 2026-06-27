import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MetricCard from "./components/MetricCard";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceChart from "./components/AttendanceChart";

const glassBadge = {
  backgroundColor: "rgba(255, 255, 255, 0.55)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(27, 27, 29, 0.08)",
};

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Dashboard" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold text-primary leading-10 tracking-tight">Dashboard</h2>
              <p className="text-secondary text-[14px] leading-5 mt-1">Selamat datang kembali, Admin. Berikut ringkasan absensi hari ini.</p>
            </div>
            <div className="px-4 py-2 rounded-xl flex items-center gap-3" style={glassBadge}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">System Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Karyawan"
              value="248"
              change="+12 bulan ini"
              changeType="positive"
              icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
            <MetricCard
              title="Hadir Hari Ini"
              value="215"
              change="86.7%"
              changeType="positive"
              icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <MetricCard
              title="Terlambat"
              value="18"
              change="-5 dari kemarin"
              changeType="positive"
              icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <MetricCard
              title="Tidak Hadir"
              value="15"
              change="+2 dari kemarin"
              changeType="negative"
              icon="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AttendanceTable />
            </div>
            <div>
              <AttendanceChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
