import React from 'react';
import { getMemberDashboardStats } from '@/lib/services/reportService';
import { getSession } from '@/lib/auth/session';
import { Calendar, Award, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import AttendanceCard from '@/components/attendance/AttendanceCard';

export default async function MemberDashboardPage() {
  const session = await getSession();
  const stats = await getMemberDashboardStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-red-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-100 font-semibold text-xs bg-red-500/20 px-3 py-1 rounded-full w-max backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{stats.greeting}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Halo, {session?.name}!
            </h2>
            <p className="text-red-100 text-xs md:text-sm font-medium">
              Selamat datang kembali di sistem absensi PMR SMK Muhammadiyah 1 Penajam Paser Utara.
            </p>
          </div>

          {/* Quick attendance info badge */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 shrink-0 md:w-48 text-center md:text-left flex flex-col justify-center">
            <p className="text-xs text-red-200 font-bold uppercase tracking-wider">Persentase Kehadiran</p>
            <div className="flex items-baseline justify-center md:justify-start gap-1 mt-2">
              <span className="text-4xl font-black font-mono tracking-tight">{stats.attendancePercentage}%</span>
            </div>
            <p className="text-[10px] text-red-200 mt-1 font-medium">
              Hadir di {stats.totalPresent} dari {stats.totalActivities} kegiatan selesai
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Activity & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Activity Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-red-600" />
              <span>Kegiatan PMR Hari Ini</span>
            </h3>
            {stats.todayActivity && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-600 rounded-full animate-pulse">
                Terjadwal
              </span>
            )}
          </div>

          {stats.todayActivity ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-950">{stats.todayActivity.title}</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{stats.todayActivity.description || 'Tidak ada deskripsi kegiatan.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">Tanggal</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(stats.todayActivity.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">Jam Kegiatan</span>
                  <span className="font-semibold text-slate-900">
                    {stats.todayActivity.startTime} - {stats.todayActivity.endTime} WIB
                  </span>
                </div>
              </div>

              {/* Interactive Attendance Module */}
              <div className="border-t border-slate-50 pt-5">
                <AttendanceCard
                  activityId={stats.todayActivity.id}
                  activityTitle={stats.todayActivity.title}
                  initialStatus={stats.todayAttendanceStatus}
                  initialTime={stats.todayAttendanceTime}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center max-w-xs mx-auto">
              <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 stroke-1" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Tidak Ada Kegiatan Terjadwal</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Hari ini tidak ada latihan rutin atau materi PMR yang dijadwalkan. Silakan beristirahat atau periksa agenda mendatang.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info/Tips */}
        <div className="space-y-6">
          {/* Quick Profile Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-black text-lg">
              {session?.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Keanggotaan PMR</span>
              <h4 className="text-sm font-bold text-slate-900 truncate">{session?.name}</h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">{session?.email}</p>
            </div>
          </div>

          {/* Golden Rules / Instructions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-red-600" />
              <span>Panduan Absensi PMR</span>
            </h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex gap-2 items-start">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>Melaporkan absensi dilakukan pada hari latihan berlangsung.</span>
              </li>
              <li className="flex gap-2 items-start">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Jika berhalangan hadir, silakan pilih opsi <span className="font-semibold text-slate-900">Izin</span> atau <span className="font-semibold text-slate-900">Sakit</span> dengan menulis alasan singkat.</span>
              </li>
              <li className="flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Tanpa pelaporan, status akan tercatat secara otomatis sebagai <span className="font-semibold text-slate-900">Alpa</span> oleh Admin setelah kegiatan selesai.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
