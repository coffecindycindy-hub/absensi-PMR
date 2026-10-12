import React from 'react';
import { getAdminDashboardStats } from '@/lib/services/reportService';
import {
  Users,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  PlusCircle,
  Activity as ActivityIcon,
  Calendar,
  ClipboardCheck
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Dashboard Ringkasan</h2>
          <p className="text-sm text-slate-500 mt-1">Sistem Manajemen & Absensi Ekstrakurikuler PMR</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/activities/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Kegiatan Baru</span>
          </Link>
          <Link
            href="/admin/members/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Anggota Baru</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Anggota Aktif</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {stats.totalMembers}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Anggota terdaftar & aktif</p>
          </div>
        </div>

        {/* Hadir Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Hadir</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {stats.todayPresent}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kehadiran hari ini</p>
          </div>
        </div>

        {/* Izin Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Izin</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {stats.todayPermission}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Siswa berizin</p>
          </div>
        </div>

        {/* Sakit Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sakit</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {stats.todaySick}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Sakit keterangan</p>
          </div>
        </div>

        {/* Alpa Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Alpa</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {stats.todayAbsent}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Tanpa keterangan</p>
          </div>
        </div>
      </div>

      {/* Grid: Recent activities vs Recent attendances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-slate-50">
            <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-red-600" />
              <span>Kegiatan Terbaru</span>
            </h3>
            <Link
              href="/admin/activities"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <span>Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 mt-4 space-y-4">
            {stats.recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Calendar className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-sm">Belum ada kegiatan terdaftar.</p>
              </div>
            ) : (
              stats.recentActivities.map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{act.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{new Date(act.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>·</span>
                      <span>{act.startTime} - {act.endTime}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

        {/* Recent Attendances */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-slate-50">
            <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-red-600" />
              <span>Absensi Masuk Terbaru</span>
            </h3>
            <Link
              href="/admin/attendance"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <span>Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 mt-4 space-y-4">
            {stats.recentAttendances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <ClipboardCheck className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-sm">Belum ada absensi tercatat.</p>
              </div>
            ) : (
              stats.recentAttendances.map((att) => (
                <div key={att.id} className="flex items-start justify-between gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{att.memberName}</h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{att.activityTitle}</p>
                    {att.note && <p className="text-[11px] text-slate-400 italic mt-0.5">&quot;{att.note}&quot;</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      att.status === 'PRESENT' ? 'bg-green-50 text-green-700' :
                      att.status === 'PERMISSION' ? 'bg-indigo-50 text-indigo-700' :
                      att.status === 'SICK' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {att.status === 'PRESENT' ? 'Hadir' :
                       att.status === 'PERMISSION' ? 'Izin' :
                       att.status === 'SICK' ? 'Sakit' :
                       'Alpa'}
                    </span>
                    {att.checkIn && (
                      <p className="text-[9px] text-slate-400 mt-1 font-mono">
                        {new Date(att.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
