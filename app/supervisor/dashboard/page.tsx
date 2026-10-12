import React from 'react';
import { getSupervisorDashboardStats } from '@/lib/services/reportService';
import {
  Users,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  Activity as ActivityIcon
} from 'lucide-react';
import Link from 'next/link';

export default async function SupervisorDashboardPage() {
  const stats = await getSupervisorDashboardStats();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Monitoring Pembina</h2>
          <p className="text-sm text-slate-500 mt-1">Halaman Pemantauan Ekstrakurikuler PMR — SMK Muhammadiyah 1 PPU</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 self-start sm:self-auto">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Akses Supervisor (Read-Only)</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Anggota PMR Aktif</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {stats.totalMembers}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Siswa terdaftar aktif</p>
          </div>
        </div>

        {/* Total Activities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Kegiatan</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {stats.totalActivities}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kegiatan latihan/materi</p>
          </div>
        </div>

        {/* Cumulative Presence Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rasio Hadir Keseluruhan</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {stats.attendanceSummary.present}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Total akumulasi kehadiran</p>
          </div>
        </div>
      </div>

      {/* Aggregate metrics sub-row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Permission */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500">Total Izin</p>
            <h4 className="text-base font-bold text-slate-950 font-mono">{stats.attendanceSummary.permission}</h4>
          </div>
        </div>

        {/* Sick */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500">Total Sakit</p>
            <h4 className="text-base font-bold text-slate-950 font-mono">{stats.attendanceSummary.sick}</h4>
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500">Total Alpa</p>
            <h4 className="text-base font-bold text-slate-950 font-mono">{stats.attendanceSummary.absent}</h4>
          </div>
        </div>
      </div>

      {/* Recent activities section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-50">
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-red-600" />
            <span>Riwayat Kegiatan Terbaru</span>
          </h3>
          <Link
            href="/supervisor/activities"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <span>Semua Kegiatan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {stats.recentActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Calendar className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-sm">Belum ada kegiatan terdaftar.</p>
            </div>
          ) : (
            stats.recentActivities.map((act) => (
              <div key={act.id} className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{act.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(act.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    <span className="mx-2">·</span>
                    {act.startTime} - {act.endTime}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  act.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                  act.status === 'ONGOING' ? 'bg-blue-50 text-blue-700' :
                  act.status === 'UPCOMING' ? 'bg-amber-50 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {act.status === 'COMPLETED' ? 'Selesai' :
                   act.status === 'ONGOING' ? 'Berjalan' :
                   act.status === 'UPCOMING' ? 'Akan Datang' :
                   'Dibatalkan'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
