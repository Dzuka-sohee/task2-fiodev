"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "calendar_today", label: "Data Absensi", href: "/absensi" },
  { icon: "devices", label: "Mesin", href: "/mesin" },
  { icon: "group", label: "Data User", href: "/user" },
  { icon: "pin", label: "Data PIN", href: "/pin" },
  { icon: "terminal", label: "API Logs", href: "/api-logs" },
  { icon: "webhook", label: "Webhooks", href: "/webhook" },
  { icon: "account_tree", label: "Alur API", href: "/alur-api" },
  { icon: "settings", label: "Pengaturan", href: "/pengaturan" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[68px] hover:w-64 transition-all duration-300 z-50 overflow-hidden bg-white/20 backdrop-blur-[24px] border-r border-black/[0.06] shadow-[4px_0_32px_rgba(0,0,0,0.08)] flex flex-col py-6 group">
      <div className="flex items-center px-6 mb-10 overflow-hidden whitespace-nowrap">
        <Image src="/topsregnif.png" alt="Tops Reg Nif" width={36} height={36} className="rounded-lg shrink-0" />
        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4">
          <span className="text-[24px] leading-[32px] font-bold text-primary">Tops Reg Nif</span>
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Attendance System</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center h-12 px-6 cursor-pointer active:scale-95 transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold border-r-4 border-primary bg-surface-variant/30"
                  : "text-secondary hover:bg-surface-variant/50"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="ml-4 text-[16px] leading-6 opacity-0 group-hover:opacity-100 whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 mt-auto border-t border-on-surface/[0.04]">
        <div className="flex items-center overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-sm text-primary">person</span>
          </div>
          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-sm font-bold text-primary">Admin Super</p>
            <p className="text-[10px] text-secondary">IT Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
