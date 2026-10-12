'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/auth/actions';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Anggota PMR', href: '/admin/members', icon: Users },
  { name: 'Kegiatan', href: '/admin/activities', icon: Calendar },
  { name: 'Data Absensi', href: '/admin/attendance', icon: ClipboardCheck },
  { name: 'Laporan', href: '/admin/reports', icon: BarChart3 },
  { name: 'Profil', href: '/admin/profile', icon: User },
];

export default function AdminShell({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      await logoutAction();
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 shrink-0">
        {/* Brand header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
            <div className="relative w-4 h-4 flex items-center justify-center">
              <div className="absolute w-4 h-1 bg-white rounded-sm" />
              <div className="absolute h-4 w-1 bg-white rounded-sm" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-sm">PMR Attendance</h1>
            <p className="text-[10px] text-slate-400">SMK Muhammadiyah 1 PPU</p>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile / Logout bottom */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-9 w-9 bg-red-600/10 text-red-500 rounded-lg flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE PANEL SHELL --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <div className="absolute w-4 h-1 bg-white rounded-sm" />
                <div className="absolute h-4 w-1 bg-white rounded-sm" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-slate-950 tracking-tight text-sm">PMR Attendance</h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Sliding Mobile Sidebar */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black z-40 lg:hidden"
              />
              {/* Menu Container */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col z-50 lg:hidden"
              >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <div className="absolute w-4 h-1 bg-white rounded-sm" />
                        <div className="absolute h-4 w-1 bg-white rounded-sm" />
                      </div>
                    </div>
                    <div>
                      <h1 className="font-bold text-white tracking-tight text-sm">PMR Attendance</h1>
                      <p className="text-[10px] text-slate-400">SMK Muhammadiyah 1 PPU</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                  {SIDEBAR_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'bg-red-600 text-white shadow-md shadow-red-900/10'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                  <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="h-9 w-9 bg-red-600/10 text-red-500 rounded-lg flex items-center justify-center font-bold text-sm">
                      AD
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{userName}</p>
                      <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Screen Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
