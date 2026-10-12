import React from 'react';
import { getSelfAttendanceHistory } from '@/lib/services/attendanceService';
import HistoryList from '@/components/attendance/HistoryList';

export default async function MemberHistoryPage() {
  const history = await getSelfAttendanceHistory();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-950 tracking-tight">Riwayat Absensi Saya</h2>
        <p className="text-xs text-slate-500 mt-1">Daftar rekaman laporan kehadiran, ketidakhadiran, atau perizinan kegiatan PMR Anda.</p>
      </div>

      <HistoryList initialHistory={history} />
    </div>
  );
}
