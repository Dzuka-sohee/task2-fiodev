"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/" },
  { icon: "calendar_today", label: "Data Absensi", href: "/absensi" },
  { icon: "devices", label: "Mesin", href: "/mesin" },
  { icon: "group", label: "Data User", href: "/user" },
  { icon: "pin", label: "Data PIN", href: "/pin" },
  { icon: "terminal", label: "API Logs", href: "/api-logs" },
  { icon: "webhook", label: "Webhooks", href: "/webhook" },
  { icon: "settings", label: "Pengaturan", href: "/pengaturan" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-[68px] hover:w-64 transition-all duration-300 z-50 overflow-hidden flex flex-col py-6 group"
      style={{
        backgroundColor: "rgba(234, 232, 231, 0.4)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderRight: "none",
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="flex items-center px-6 mb-10 overflow-hidden whitespace-nowrap">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        >
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
        </div>
        <div className="flex flex-col ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[17px] font-bold text-primary leading-tight">Fingerspot</span>
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Attendance System</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center h-11 px-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.5)" : "transparent",
                color: isActive ? "#1d2b3e" : "#505f76",
                fontWeight: isActive ? 700 : 500,
                borderLeft: isActive ? "3px solid #1d2b3e" : "3px solid transparent",
              }}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="ml-4 text-[15px] leading-6 opacity-0 group-hover:opacity-100 whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 mt-auto" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.5)" }}>
        <div className="flex items-center overflow-hidden">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <span className="material-symbols-outlined text-sm text-primary">person</span>
          </div>
          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-sm font-bold text-primary">Admin User</p>
            <p className="text-[10px] text-secondary">System Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
