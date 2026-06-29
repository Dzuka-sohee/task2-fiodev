"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { createClient } from "@/lib/supabase/client";

interface UserItem {
  id?: string;
  pin: string;
  name: string;
  privilege: number;
  card_no: string | null;
  password?: string;
  enabled: boolean;
  device_sn: string | null;
  synced_at: string | null;
}

interface PinItem {
  pin: string;
  device_sn: string | null;
}

const privilegeLabels: Record<number, string> = {
  0: "Admin",
  1: "User",
  2: "Supervisor",
};

const privilegeValues = [
  { value: 1, label: "User" },
  { value: 2, label: "Admin/Manager" },
  { value: 3, label: "Subadmin/Supervisor" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Inactive: "bg-outline-variant/30 text-outline",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  { bg: "bg-primary-fixed", text: "text-primary" },
  { bg: "bg-secondary-fixed", text: "text-secondary" },
  { bg: "bg-tertiary-fixed", text: "text-tertiary" },
  { bg: "bg-primary-fixed-dim", text: "text-primary" },
  { bg: "bg-surface-container-high", text: "text-secondary" },
];

const PAGE_SIZE = 20;

interface UserFormData {
  pin: string;
  name: string;
  privilege: number;
  password: string;
  rfid: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [allPins, setAllPins] = useState<PinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedPins, setSelectedPins] = useState<Set<string>>(new Set());
  const [modalSearch, setModalSearch] = useState("");
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState<UserFormData>({ pin: "", name: "", privilege: 1, password: "111", rfid: "" });
  const [editTarget, setEditTarget] = useState<UserItem | null>(null);
  const [formSending, setFormSending] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [deleteSending, setDeleteSending] = useState(false);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<UserItem | null>(null);
  const [verifySending, setVerifySending] = useState(false);

  const [openMenuPin, setOpenMenuPin] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuPin(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    setLoading(true);
    const supabase = createClient();

    const [usersRes, pinsRes] = await Promise.all([
      supabase.from("userinfos").select("*").order("name"),
      supabase.from("pins").select("pin, device_sn").order("pin"),
    ]);

    if (!usersRes.error && usersRes.data) {
      setUsers(usersRes.data);
    }
    if (!pinsRes.error && pinsRes.data) {
      setAllPins(pinsRes.data);
    }
    setLoading(false);
  };

  const existingUserPins = new Set(users.map((u) => u.pin));

  const filteredModalPins = allPins.filter((p) =>
    p.pin.includes(modalSearch)
  );

  const visiblePinsCount = filteredModalPins.length;
  const selectedCount = selectedPins.size;

  const allVisibleSelected =
    visiblePinsCount > 0 &&
    filteredModalPins.every((p) => selectedPins.has(p.pin));

  const handleOpenModal = () => {
    setSelectedPins(new Set());
    setModalSearch("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPins(new Set());
    setModalSearch("");
    setSyncProgress({ current: 0, total: 0 });
  };

  const handleToggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedPins(new Set());
    } else {
      setSelectedPins(new Set(filteredModalPins.map((p) => p.pin)));
    }
  };

  const handleTogglePin = (pin: string) => {
    setSelectedPins((prev) => {
      const next = new Set(prev);
      if (next.has(pin)) {
        next.delete(pin);
      } else {
        next.add(pin);
      }
      return next;
    });
  };

  const handleSyncSelected = async () => {
    const pinsToSync = Array.from(selectedPins);
    if (pinsToSync.length === 0) return;

    const totalPins = pinsToSync.length;
    setMessage(`Mengirim command get_userinfo untuk ${totalPins} PIN...`);
    setSyncing(true);
    setSyncProgress({ current: 0, total: totalPins });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < totalPins; i++) {
      const pin = pinsToSync[i];
      setSyncProgress({ current: i + 1, total: totalPins });

      try {
        const res = await fetch("/mesin/get-userinfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin, trans_id: Date.now().toString() }),
        });
        const result = await res.json();
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(`[Sync] Pin ${pin} error:`, err);
        failCount++;
      }
    }

    setShowModal(false);
    setSyncProgress({ current: 0, total: 0 });
    setSyncing(false);
    setMessage(`Command dikirim: ${successCount} berhasil, ${failCount} gagal. Data akan muncul beberapa saat.`);

    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      const supabase = createClient();
      const { data } = await supabase.from("userinfos").select("*").order("name");
      if (data) {
        setUsers(data);
      }
      if (attempts >= 10) {
        clearInterval(poll);
        setMessage("Sinkronisasi selesai. Periksa tabel untuk data terbaru.");
        setTimeout(() => setMessage(""), 5000);
      }
    }, 2000);
  };

  const handleOpenAddUser = () => {
    setFormMode("add");
    setForm({ pin: "", name: "", privilege: 1, password: "111", rfid: "" });
    setEditTarget(null);
    setShowFormModal(true);
  };

  const handleOpenEditUser = (user: UserItem) => {
    setFormMode("edit");
    setForm({
      pin: user.pin,
      name: user.name || "",
      privilege: user.privilege ?? 1,
      password: user.password || "111",
      rfid: user.card_no || "",
    });
    setEditTarget(user);
    setShowFormModal(true);
    setOpenMenuPin(null);
  };

  const handleFormSubmit = async () => {
    if (!form.pin.trim() || !form.name.trim()) return;
    setFormSending(true);

    try {
      const res = await fetch("/mesin/set-userinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: form.pin,
          name: form.name,
          privilege: form.privilege,
          password: form.password,
          rfid: form.rfid,
          template: "",
          trans_id: Date.now().toString(),
        }),
      });
      const result = await res.json();

      setShowFormModal(false);
      setFormSending(false);

      if (result.success) {
        setMessage(formMode === "add"
          ? "Command tambah user dikirim. Data akan muncul beberapa saat."
          : "Command edit user dikirim. Data akan diperbarui beberapa saat."
        );
        setTimeout(() => setMessage(""), 8000);
      } else {
        setMessage(`Gagal: ${result.message}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch {
      setFormSending(false);
      setMessage("Error: Gagal mengirim command.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleOpenDelete = (user: UserItem) => {
    setDeleteTarget(user);
    setShowDeleteModal(true);
    setOpenMenuPin(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSending(true);

    try {
      const res = await fetch("/mesin/delete-userinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: deleteTarget.pin,
          trans_id: Date.now().toString(),
        }),
      });
      const result = await res.json();

      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteSending(false);

      if (result.success) {
        setMessage(`User PIN ${deleteTarget.pin} berhasil dihapus.`);
        setTimeout(() => setMessage(""), 5000);
        const supabase = createClient();
        const { data } = await supabase.from("userinfos").select("*").order("name");
        if (data) setUsers(data);
      } else {
        setMessage(`Gagal: ${result.message}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch {
      setDeleteSending(false);
      setMessage("Error: Gagal mengirim command.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleOpenVerify = (user: UserItem) => {
    setVerifyTarget(user);
    setShowVerifyModal(true);
    setOpenMenuPin(null);
  };

  const handleVerifySubmit = async (verification: string) => {
    if (!verifyTarget) return;
    setVerifySending(true);

    try {
      const res = await fetch("/mesin/register-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: verifyTarget.pin,
          verification,
          trans_id: Date.now().toString(),
        }),
      });
      const result = await res.json();

      setShowVerifyModal(false);
      setVerifyTarget(null);
      setVerifySending(false);

      if (result.success) {
        setMessage(`Command registrasi verifikasi untuk PIN ${verifyTarget.pin} dikirim.`);
        setTimeout(() => setMessage(""), 8000);
      } else {
        setMessage(`Gagal: ${result.message}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch {
      setVerifySending(false);
      setMessage("Error: Gagal mengirim command.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.pin.includes(search)
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen">
        <Topbar title="Data User" />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
          <section className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/3 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px]">search</span>
              <input
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/55 backdrop-blur-xl border border-on-surface/[0.08] shadow-[0px_10px_30px_rgba(51,65,85,0.05)] text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                placeholder="Search by Name or PIN..."
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleOpenModal}
                disabled={syncing || allPins.length === 0}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/55 backdrop-blur-xl border border-on-surface/[0.08] shadow-[0px_10px_30px_rgba(51,65,85,0.05)] text-secondary font-semibold hover:bg-surface-container-highest transition-all text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">sync</span>
                Sinkronisasi dari Mesin
              </button>
              <button
                onClick={handleOpenAddUser}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[14px]"
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Tambah User
              </button>
            </div>
          </section>

          {message && (
            <div className={`px-4 py-3 rounded-xl text-[14px] font-medium ${
              message.includes("Gagal") || message.includes("gagal") || message.includes("Error")
                ? "bg-error/10 text-error"
                : "bg-green-50 text-green-700"
            }`}>
              {message}
            </div>
          )}

          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">PIN</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Privilege</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Card No</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.05]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-secondary">
                        <span className="material-symbols-outlined animate-spin text-3xl mb-2">progress_activity</span>
                        <p className="text-[14px]">Memuat data user...</p>
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-secondary">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline">person_off</span>
                        <p className="text-[14px]">
                          {users.length === 0
                            ? "Belum ada data user. Klik \"Sinkronisasi dari Mesin\" untuk mengambil data."
                            : "User tidak ditemukan."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, idx) => {
                      const globalIdx = (safePage - 1) * PAGE_SIZE + idx;
                      const color = avatarColors[globalIdx % avatarColors.length];
                      return (
                        <tr key={user.id ?? user.pin} className="hover:bg-[rgba(29,43,62,0.03)] transition-colors">
                          <td className="px-6 py-4 text-[14px] text-secondary">{String(globalIdx + 1).padStart(2, "0")}</td>
                          <td className="px-6 py-4 text-[14px] font-semibold text-primary">{user.pin}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center ${color.text} text-[10px] font-bold`}>
                                {getInitials(user.name || "U")}
                              </div>
                              <span className="text-[14px] font-semibold text-primary">{user.name || "-"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[14px] text-secondary">{privilegeLabels[user.privilege] ?? "User"}</td>
                          <td className="px-6 py-4 text-[14px] text-outline">{user.card_no || "-"}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full ${user.enabled ? statusStyles.Active : statusStyles.Inactive} text-[10px] font-bold uppercase tracking-tight`}>
                              {user.enabled ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end" ref={openMenuPin === user.pin ? menuRef : undefined}>
                              <button
                                onClick={() => setOpenMenuPin(openMenuPin === user.pin ? null : user.pin)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-variant transition-colors"
                              >
                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                              </button>
                              {openMenuPin === user.pin && (
                                <div className="relative ml-1">
                                  <div className="absolute right-0 top-0 mt-8 w-44 bg-white rounded-xl shadow-xl border border-on-surface/[0.08] z-50 py-1">
                                    <button
                                      onClick={() => handleOpenEditUser(user)}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-secondary hover:bg-surface-variant/50 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">edit</span>
                                      Edit User
                                    </button>
                                    <button
                                      onClick={() => handleOpenDelete(user)}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-error hover:bg-error/5 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">delete</span>
                                      Hapus User
                                    </button>
                                    <div className="border-t border-on-surface/[0.05] my-1" />
                                    <button
                                      onClick={() => handleOpenVerify(user)}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-secondary hover:bg-surface-variant/50 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                                      Tambah Verifikasi
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-surface-container-low/30 border-t border-on-surface/[0.05] flex items-center justify-between">
              <span className="text-[12px] font-semibold text-secondary">
                Menampilkan {filteredUsers.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(safePage * PAGE_SIZE, filteredUsers.length)} dari {filteredUsers.length} data user
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                  .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span key={`e${idx}`} className="w-8 h-8 flex items-center justify-center text-secondary text-[12px]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-semibold transition-colors ${
                          item === safePage
                            ? "bg-primary text-white"
                            : "text-secondary hover:bg-surface-variant"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Total Users</span>
              <div className="mt-4">
                <span className="text-[48px] font-bold text-primary leading-none">{String(users.length).padStart(2, "0")}</span>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Admins</span>
              <div className="mt-4">
                <span className="text-[48px] font-bold text-primary leading-none">
                  {String(users.filter((u) => u.privilege === 0 || u.privilege === 2).length).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">PIN Tersinkron</span>
              <div className="mt-4">
                <span className="text-[48px] font-bold text-primary leading-none">{users.length}</span>
                <p className="text-[14px] text-secondary mt-2">dari {allPins.length} PIN di mesin</p>
              </div>
            </div>
            <div className="md:col-span-1 glass-panel p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Perlu Sync</span>
              <div className="mt-4">
                <span className="text-[48px] font-bold text-tertiary leading-none">
                  {Math.max(0, allPins.length - users.length)}
                </span>
                <p className="text-[14px] text-secondary mt-2">PIN belum ada data user</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-transparent" onClick={handleCloseModal} />
          <div className="relative bg-white/50 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-on-surface/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-primary">Sinkronisasi User dari Mesin</h3>
                  <p className="text-[13px] text-secondary mt-1">Pilih PIN yang ingin disinkronkan data user-nya</p>
                </div>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-3 border-b border-on-surface/[0.05]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-secondary">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container/50 border-none text-[13px] focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="Cari PIN..."
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-2 border-b border-on-surface/[0.05] flex items-center gap-3 bg-surface-container-low/30">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={allVisibleSelected} onChange={handleToggleSelectAll} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/30 cursor-pointer" />
                <span className="text-[13px] font-medium text-secondary">Pilih Semua ({visiblePinsCount})</span>
              </label>
              <span className="text-outline-variant">|</span>
              <span className="text-[13px] text-primary font-semibold">{selectedCount} dipilih</span>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredModalPins.length === 0 ? (
                <div className="px-6 py-12 text-center text-secondary">
                  <span className="material-symbols-outlined text-4xl mb-2 text-outline">key_off</span>
                  <p className="text-[14px]">Tidak ada PIN ditemukan</p>
                </div>
              ) : (
                <div className="divide-y divide-on-surface/[0.03]">
                  {filteredModalPins.map((pinItem) => {
                    const hasUser = existingUserPins.has(pinItem.pin);
                    const isSelected = selectedPins.has(pinItem.pin);
                    return (
                      <label key={pinItem.pin} className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-surface-variant/30"}`}>
                        <input type="checkbox" checked={isSelected} onChange={() => handleTogglePin(pinItem.pin)} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/30 cursor-pointer" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-primary font-mono tracking-wider">{pinItem.pin}</span>
                            {hasUser && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                Ada Data
                              </span>
                            )}
                          </div>
                          {pinItem.device_sn && <span className="text-[11px] text-outline font-mono">{pinItem.device_sn}</span>}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-on-surface/[0.08] bg-surface-container-low/30">
              {syncing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-secondary">Mengirim command ke mesin...</span>
                    <span className="font-semibold text-primary">{syncProgress.current} / {syncProgress.total}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-3">
                  <button onClick={handleCloseModal} className="px-5 py-2 rounded-xl text-[13px] font-semibold text-secondary hover:bg-surface-variant transition-colors">Batal</button>
                  <button onClick={handleSyncSelected} disabled={selectedCount === 0} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-[13px] font-semibold shadow-md hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined text-[18px]">sync</span>
                    Sinkronkan {selectedCount} PIN
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-transparent" onClick={() => !formSending && setShowFormModal(false)} />
          <div className="relative bg-white/50 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-on-surface/[0.08]">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-primary">
                  {formMode === "add" ? "Tambah User Baru" : "Edit User"}
                </h3>
                <button onClick={() => !formSending && setShowFormModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1.5 block">PIN / User ID</label>
                <input
                  type="text"
                  value={form.pin}
                  onChange={(e) => setForm({ ...form, pin: e.target.value })}
                  disabled={formMode === "edit"}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] font-mono focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Masukkan PIN"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Masukkan nama"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1.5 block">Privilege</label>
                <select
                  value={form.privilege}
                  onChange={(e) => setForm({ ...form, privilege: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  {privilegeValues.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1.5 block">Password</label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Default: 111"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1.5 block">RFID Card No</label>
                <input
                  type="text"
                  value={form.rfid}
                  onChange={(e) => setForm({ ...form, rfid: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Opsional"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-on-surface/[0.08] flex items-center justify-end gap-3">
              <button onClick={() => !formSending && setShowFormModal(false)} disabled={formSending} className="px-5 py-2 rounded-xl text-[13px] font-semibold text-secondary hover:bg-surface-variant transition-colors disabled:opacity-50">Batal</button>
              <button
                onClick={handleFormSubmit}
                disabled={formSending || !form.pin.trim() || !form.name.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-[13px] font-semibold shadow-md hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formSending ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">save</span>
                )}
                {formMode === "add" ? "Tambah User" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-transparent" onClick={() => !deleteSending && setShowDeleteModal(false)} />
          <div className="relative bg-white/50 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl w-full max-w-sm mx-4">
            <div className="px-6 py-5 text-center">
              <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[28px] text-error">delete</span>
              </div>
              <h3 className="text-[18px] font-semibold text-primary mb-2">Hapus User?</h3>
              <p className="text-[14px] text-secondary">
                User dengan PIN <span className="font-mono font-semibold text-primary">{deleteTarget.pin}</span>
                {deleteTarget.name && <>, <span className="font-semibold">{deleteTarget.name}</span></>}
                {" "}akan dihapus dari mesin. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-on-surface/[0.08] flex items-center justify-center gap-3">
              <button onClick={() => setShowDeleteModal(false)} disabled={deleteSending} className="px-5 py-2 rounded-xl text-[13px] font-semibold text-secondary hover:bg-surface-variant transition-colors disabled:opacity-50">Batal</button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteSending}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-error text-white text-[13px] font-semibold shadow-md hover:bg-error/90 active:scale-95 transition-all disabled:opacity-50"
              >
                {deleteSending ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                )}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerifyModal && verifyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-transparent" onClick={() => !verifySending && setShowVerifyModal(false)} />
          <div className="relative bg-white/50 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl w-full max-w-sm mx-4">
            <div className="px-6 py-4 border-b border-on-surface/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-primary">Tambah Verifikasi</h3>
                  <p className="text-[13px] text-secondary mt-1">
                    PIN: <span className="font-mono font-semibold">{verifyTarget.pin}</span>
                    {verifyTarget.name && <> — {verifyTarget.name}</>}
                  </p>
                </div>
                <button onClick={() => !verifySending && setShowVerifyModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p className="text-[13px] text-secondary mb-1">Pilih jenis verifikasi yang ingin didaftarkan:</p>

              <button
                onClick={() => handleVerifySubmit("12")}
                disabled={verifySending}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-on-surface/[0.08] hover:bg-primary/5 hover:border-primary/30 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[24px] text-primary">face</span>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-primary">Wajah (Face ID)</p>
                  <p className="text-[11px] text-secondary">Verifikasi menggunakan pengenalan wajah</p>
                </div>
              </button>

              <button
                onClick={() => handleVerifySubmit("13")}
                disabled={verifySending}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-on-surface/[0.08] hover:bg-primary/5 hover:border-primary/30 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[24px] text-primary">visibility</span>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-primary">Vein</p>
                  <p className="text-[11px] text-secondary">Verifikasi menggunakan pola pembuluh vena</p>
                </div>
              </button>

              <div className="border-t border-on-surface/[0.05] pt-3">
                <p className="text-[13px] text-secondary mb-2">Sidik Jari (Fingerprint) — Pilih ID jari:</p>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }, (_, i) => String(i)).map((id) => (
                    <button
                      key={id}
                      onClick={() => handleVerifySubmit(id)}
                      disabled={verifySending}
                      className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl border border-on-surface/[0.08] hover:bg-primary/5 hover:border-primary/30 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[22px] text-primary">fingerprint</span>
                      <span className="text-[11px] font-semibold text-secondary">ID {id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {verifySending && (
              <div className="px-6 py-3 text-center">
                <span className="text-[13px] text-primary font-medium">Mengirim command ke mesin...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
