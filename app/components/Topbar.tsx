"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState("User");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUserName(data.user.full_name);
          setUserRole(data.user.role === "admin" ? "Administrator" : "User");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-white/30 backdrop-blur-[24px] border-b border-black/[0.06] shadow-[0_4px_32px_rgba(0,0,0,0.06)] flex justify-between items-center h-16 px-6 lg:px-10">
      <h2 className="text-[20px] leading-[28px] font-semibold text-primary">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-colors">
          <span className="material-symbols-outlined text-secondary">notifications</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant/30"></div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">{userName}</p>
              <p className="text-[12px] leading-4 text-secondary font-semibold" style={{ letterSpacing: "0.05em" }}>{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center border border-primary/10">
              <span className="text-sm font-bold text-primary">{getInitials(userName)}</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl shadow-lg shadow-primary/10 border border-outline-variant/20 overflow-hidden z-50">
              <div className="p-4 border-b border-outline-variant/20">
                <p className="text-sm font-bold text-primary">{userName}</p>
                <p className="text-xs text-secondary">{userRole}</p>
              </div>
              <div className="py-2">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-surface-variant/30 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  <span>Edit Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
