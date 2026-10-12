import React from 'react';
import { db } from '@/lib/db/db';
import AttendanceViewSheet from '@/components/attendance/AttendanceViewSheet';
import { Calendar, ClipboardCheck, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function SupervisorAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ activityId?: string }>;
}) {
  const { activityId } = await searchParams;

  const activities = db.getActivities();
  const members = db.getMembers().filter(m => m.status === 'ACTIVE');
  const allAttendances = db.getAttendances();

  if (activityId) {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) {
      return (
        <div className="space-y-6 text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Kegiatan Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mt-2">Kegiatan dengan ID tersebut tidak tersedia atau telah dihapus.</p>
          <div className="pt-4">
            <Link href="/supervisor/attendance" className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-xs">
              Kembali ke Daftar
            </Link>
          </div>
        </div>
      );
    }

    const activityAttendances = allAttendances.filter(att => att.activityId === activityId);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link
            href="/supervisor/attendance"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-950 transition-colors"
            title="Kembali ke Pilih Kegiatan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-950 tracking-tight">Pantau Kehadiran Anggota</h2>
            <p className="text-xs text-slate-500 mt-1">Daftar laporan kehadiran anggota PMR pada kegiatan latihan ini.</p>
          </div>
        </div>

        <AttendanceViewSheet
          activity={activity}
          members={members}
          attendances={activityAttendances}
        />
      </div>
    );
  }

  // Else, show activity selector list for Supervisor

  const sortedActivities = [...activities].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-950 tracking-tight">Monitoring Absensi Kegiatan</h2>
        <p className="text-xs text-slate-500 mt-1">Pilih kegiatan kesiswaan untuk melihat status absensi dan kehadiran anggota PMR.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Kegiatan</th>
                <th className="px-6 py-4">Tanggal Pelaksanaan</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4 text-center">Status Agenda</th>
                <th className="px-6 py-4 text-center">Rasio Lapor</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <ClipboardCheck className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-slate-500">Belum ada kegiatan kesiswaan</p>
                  </td>
                </tr>
              ) : (
                sortedActivities.map((act) => {
                  const activityAtts = allAttendances.filter(att => att.activityId === act.id);
                  const statusLabels = {
                    UPCOMING: 'Akan Datang',
                    ONGOING: 'Berjalan',
                    COMPLETED: 'Selesai',
                    CANCELLED: 'Dibatalkan',
                  };

                  return (
                    <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{act.title}</td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {new Date(act.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500">{act.startTime} - {act.endTime} WIB</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          act.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                          act.status === 'ONGOING' ? 'bg-blue-50 text-blue-700' :
                          act.status === 'UPCOMING' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {statusLabels[act.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold font-mono text-slate-800">
                        {activityAtts.length} / {members.length}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/supervisor/attendance?activityId=${act.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <span>Lihat Absensi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
