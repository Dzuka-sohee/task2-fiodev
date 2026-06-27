import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen">
        <Topbar title="Dashboard" />
        <div className="p-6 lg:p-10 space-y-6">
          {/* Row 1: Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 - Kehadiran Hari Ini */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined">person_check</span>
                </div>
                <span className="text-[12px] font-semibold flex items-center text-green-600">
                  +12%{" "}
                  <span className="material-symbols-outlined text-[14px]">
                    trending_up
                  </span>
                </span>
              </div>
              <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold">
                Kehadiran Hari Ini
              </h3>
              <p className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary mt-1">
                1,284
              </p>
              <div className="mt-4 h-12 w-full flex items-end gap-1">
                <div className="flex-1 bg-primary/20 h-[40%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/20 h-[60%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/20 h-[30%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/40 h-[80%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/60 h-[90%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary h-[100%] rounded-t-sm"></div>
              </div>
            </div>

            {/* Card 2 - Total Karyawan */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary-container/30 text-on-secondary-container rounded-lg">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <span className="text-[12px] font-semibold text-secondary">
                  Total
                </span>
              </div>
              <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold">
                Total Karyawan
              </h3>
              <p className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary mt-1">
                1,350
              </p>
              <div className="mt-4 h-12 flex items-center">
                <div className="w-full bg-surface-variant/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[95%]"></div>
                </div>
              </div>
            </div>

            {/* Card 3 - Request API Hari Ini */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-tertiary-fixed/30 text-on-tertiary-fixed-variant rounded-lg">
                  <span className="material-symbols-outlined">api</span>
                </div>
                <span className="text-[12px] font-semibold flex items-center text-red-500">
                  -2%{" "}
                  <span className="material-symbols-outlined text-[14px]">
                    trending_down
                  </span>
                </span>
              </div>
              <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold">
                Request API Hari Ini
              </h3>
              <p className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary mt-1">
                48.2k
              </p>
              <div className="mt-4 h-12 w-full flex items-end gap-1">
                <div className="flex-1 bg-tertiary-fixed h-[80%] rounded-t-sm"></div>
                <div className="flex-1 bg-tertiary-fixed h-[100%] rounded-t-sm"></div>
                <div className="flex-1 bg-tertiary-fixed h-[70%] rounded-t-sm"></div>
                <div className="flex-1 bg-tertiary-fixed h-[50%] rounded-t-sm"></div>
                <div className="flex-1 bg-tertiary-fixed h-[60%] rounded-t-sm"></div>
                <div className="flex-1 bg-tertiary-fixed/40 h-[40%] rounded-t-sm"></div>
              </div>
            </div>

            {/* Card 4 - Webhook Diterima */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-outline-variant/30 text-secondary rounded-lg">
                  <span className="material-symbols-outlined">webhook</span>
                </div>
                <span className="text-[12px] font-semibold text-green-600">
                  Stable
                </span>
              </div>
              <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold">
                Webhook Diterima
              </h3>
              <p className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary mt-1">
                9,102
              </p>
              <div className="mt-4 h-12 flex items-center justify-center gap-2">
                <div className="animate-pulse w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-[12px] font-semibold text-secondary">
                  Real-time sync active
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Chart + Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Attendance Trend */}
            <div className="lg:col-span-8 glass-card p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                    Attendance Trend
                  </h3>
                  <p className="text-secondary text-sm">Past 30 days visualization</p>
                </div>
                <select className="bg-surface-variant/30 border-none rounded-xl text-[12px] font-semibold text-secondary outline-none px-4 py-2">
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <div className="h-64 w-full relative flex items-end">
                <svg
                  className="w-full h-full stroke-primary fill-none stroke-[3]"
                  viewBox="0 0 800 200"
                >
                  <path
                    d="M0,180 Q100,160 150,140 T250,120 T350,150 T450,100 T550,80 T650,110 T800,90"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M0,180 Q100,160 150,140 T250,120 T350,150 T450,100 T550,80 T650,110 T800,90 V200 H0 Z"
                    fill="url(#grad1)"
                    opacity="0.1"
                    stroke="none"
                  ></path>
                  <defs>
                    <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#1d2b3e" stopOpacity="1"></stop>
                      <stop offset="100%" stopColor="#1d2b3e" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 text-[12px] font-semibold text-secondary/60">
                  <span>01 Oct</span>
                  <span>10 Oct</span>
                  <span>20 Oct</span>
                  <span>30 Oct</span>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="lg:col-span-4 glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-tertiary-container">
                  emoji_events
                </span>
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                  Top Performers
                </h3>
              </div>
              <div className="space-y-4">
                {/* Performer 1 */}
                <div className="flex items-center gap-4 p-2 rounded-lg bg-tertiary-fixed/10 border border-tertiary-fixed/20">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm">
                      AL
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-primary">Adinda Larasati</p>
                    <p className="text-[12px] font-semibold text-secondary">
                      No Late Scans
                    </p>
                  </div>
                  <span
                    className="material-symbols-outlined text-yellow-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    workspace_premium
                  </span>
                </div>

                {/* Performer 2 */}
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-variant/30 transition-colors">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold text-sm">
                      BS
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-primary">Budi Santoso</p>
                    <p className="text-[12px] font-semibold text-secondary">
                      99% On-time
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">
                    military_tech
                  </span>
                </div>

                {/* Performer 3 */}
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-variant/30 transition-colors">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-sm">
                      CK
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-300 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-primary">Citra Kirana</p>
                    <p className="text-[12px] font-semibold text-secondary">
                      Perfect Monthly
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-orange-400">
                    military_tech
                  </span>
                </div>
              </div>
              <button className="w-full mt-6 py-2 border border-outline-variant/30 rounded-xl text-[12px] font-bold text-secondary hover:bg-surface-variant/50 transition-all">
                View Leaderboard
              </button>
            </div>
          </div>

          {/* Row 3: Bar Chart + Logs Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Weekly Comparison Bar Chart */}
            <div className="lg:col-span-5 glass-card p-6 rounded-xl">
              <h3 className="text-[20px] leading-[28px] font-semibold text-primary mb-6">
                Weekly Comparison
              </h3>
              <div className="h-64 flex items-end justify-between px-4 pb-4">
                {/* Monday */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-primary rounded-t-md h-32"></div>
                  <span className="text-[12px] font-semibold text-secondary">M</span>
                </div>
                {/* Tuesday */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-primary/80 rounded-t-md h-40"></div>
                  <span className="text-[12px] font-semibold text-secondary">T</span>
                </div>
                {/* Wednesday */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-primary/90 rounded-t-md h-48"></div>
                  <span className="text-[12px] font-semibold text-secondary">W</span>
                </div>
                {/* Thursday */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-primary rounded-t-md h-44"></div>
                  <span className="text-[12px] font-semibold text-secondary">T</span>
                </div>
                {/* Friday */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-primary/60 rounded-t-md h-36"></div>
                  <span className="text-[12px] font-semibold text-secondary">F</span>
                </div>
                {/* Saturday */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-outline-variant rounded-t-md h-12"></div>
                  <span className="text-[12px] font-semibold text-secondary">S</span>
                </div>
                {/* Sunday */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-outline-variant rounded-t-md h-8"></div>
                  <span className="text-[12px] font-semibold text-secondary">S</span>
                </div>
              </div>
            </div>

            {/* Recent Logs Table */}
            <div className="lg:col-span-7 glass-card p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                  Recent Logs
                </h3>
                <button className="text-[12px] font-bold text-primary flex items-center gap-1">
                  View All{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[12px] font-semibold text-secondary border-b border-outline-variant/20 uppercase tracking-widest">
                      <th className="pb-4 font-bold">Employee</th>
                      <th className="pb-4 font-bold">Scan Time</th>
                      <th className="pb-4 font-bold">Location</th>
                      <th className="pb-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {/* Row 1 */}
                    <tr className="border-b border-outline-variant/10 group hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          DS
                        </div>
                        <span className="font-bold text-primary">Dedi Setiadi</span>
                      </td>
                      <td className="py-4 text-secondary">08:02 AM</td>
                      <td className="py-4 text-secondary">Main Office</td>
                      <td className="py-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                          Present
                        </span>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="border-b border-outline-variant/10 group hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                          RK
                        </div>
                        <span className="font-bold text-primary">Rina Kartika</span>
                      </td>
                      <td className="py-4 text-secondary">08:15 AM</td>
                      <td className="py-4 text-secondary">Warehouse A</td>
                      <td className="py-4">
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                          Late
                        </span>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="border-b border-outline-variant/10 group hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary font-bold text-xs">
                          AB
                        </div>
                        <span className="font-bold text-primary">Agus Budiman</span>
                      </td>
                      <td className="py-4 text-secondary">08:30 AM</td>
                      <td className="py-4 text-secondary">Remote</td>
                      <td className="py-4">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                          On Duty
                        </span>
                      </td>
                    </tr>
                    {/* Row 4 */}
                    <tr className="group hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-bold text-xs">
                          MH
                        </div>
                        <span className="font-bold text-primary">Maya Hapsari</span>
                      </td>
                      <td className="py-4 text-secondary">07:55 AM</td>
                      <td className="py-4 text-secondary">Lobby 2</td>
                      <td className="py-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                          Present
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
