'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/auth/actions';
import {
  LayoutDashboard,
  Calendar,
  History,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Beranda', href: '/member/dashboard', icon: LayoutDashboard },
  { name: 'Kegiatan PMR', href: '/member/activities', icon: Calendar },
  { name: 'Riwayat Absensi', href: '/member/history', icon: History },
  { name: 'Profil Saya', href: '/member/profile', icon: User },
];

export default function MemberShell({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      await logoutAction();
    }
  };

  const isActive = (href: string) => {
    if (href === '/member/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* --- MOBILE & DESKTOP SHARED TOP BAR --- */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
            <div className="relative w-4 h-4 flex items-center justify-center">
              <div className="absolute w-4 h-1 bg-white rounded-sm" />
              <div className="absolute h-4 w-1 bg-white rounded-sm" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-slate-950 tracking-tight text-sm">PMR Attendance</h1>
            <p className="text-[10px] text-red-600 font-semibold uppercase tracking-wider">Anggota PMR</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {SIDEBAR_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          <div className="w-[1px] h-6 bg-slate-100 mx-2" />

          {/* User badge */}
          <div className="flex items-center gap-3 pl-1 pr-3 py-1 bg-slate-50 rounded-full border border-slate-100">
            <div className="h-7 w-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">{userName}</span>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* --- MOBILE FULL-SCREEN DROPDOWN OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 shadow-lg z-30 flex flex-col py-4 px-4 gap-1"
          >
            {SIDEBAR_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-red-50 text-red-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="border-t border-slate-100 my-2 pt-2" />
            <div className="flex items-center justify-between px-4 py-2">
              <div>
                <p className="text-xs font-bold text-slate-900">{userName}</p>
                <p className="text-[10px] text-slate-500">{userEmail}</p>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>

      {/* --- PREMIUM MOBILE BOTTOM NAV BAR (strictly under 15% mobile sticky height check) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-30 px-2 shadow-inner">
        {SIDEBAR_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
                active ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0 mb-0.5" />
              <span className="text-[10px] font-semibold truncate max-w-[70px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
