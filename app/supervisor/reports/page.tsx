import React from 'react';
import { generateAttendanceReport } from '@/lib/services/reportService';
import ReportFilterForm from '@/components/reports/ReportFilterForm';
import {
  Calendar,
  Users,
  Percent,
  CheckCircle,
  FileText,
  ShieldAlert
} from 'lucide-react';

export default async function SupervisorReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const { startDate, endDate } = await searchParams;

  const report = await generateAttendanceReport({ startDate, endDate });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Laporan Kehadiran PMR</h2>
          <p className="text-xs text-slate-500 mt-1">Pemantauan rekapitulasi data kehadiran kesiswaan PMR secara kolektif.</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 self-start sm:self-auto">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Akses Supervisor (Read-Only)</span>
        </div>
      </div>

      {/* Date Filter */}
      <ReportFilterForm basePath="/supervisor/reports" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Activities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kegiatan Selesai</span>
            <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-950 font-mono tracking-tight">{report.totalActivities}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Jumlah latihan kesiswaan</p>
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Anggota Aktif</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-950 font-mono tracking-tight">{report.totalMembers}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Anggota PMR aktif</p>
          </div>
        </div>

        {/* Overall Percentage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Kehadiran</span>
            <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-950 font-mono tracking-tight">{report.overallStats.percentage}%</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Rasio keseluruhan hadir</p>
          </div>
        </div>

        {/* Aggregate Present */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Hadir</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-950 font-mono tracking-tight">{report.overallStats.present}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Laporan hadir kolektif</p>
          </div>
        </div>
      </div>

      {/* Aggregate breakdown */}
      <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akumulasi Izin</span>
          <h4 className="text-base font-bold text-indigo-700 font-mono mt-1">{report.overallStats.permission}</h4>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akumulasi Sakit</span>
          <h4 className="text-base font-bold text-amber-700 font-mono mt-1">{report.overallStats.sick}</h4>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akumulasi Alpa</span>
          <h4 className="text-base font-bold text-red-600 font-mono mt-1">{report.overallStats.absent}</h4>
        </div>
      </div>

      {/* Member Rekap Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden font-sans">
        <div className="px-6 py-4 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-red-600" />
            <span>Rekap Kehadiran Anggota PMR</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Anggota</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4 text-center">Hadir</th>
                <th className="px-6 py-4 text-center">Izin</th>
                <th className="px-6 py-4 text-center">Sakit</th>
                <th className="px-6 py-4 text-center">Alpa</th>
                <th className="px-6 py-4 text-right">Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {report.memberRekap.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    Belum ada data anggota.
                  </td>
                </tr>
              ) : (
                report.memberRekap.map((m) => (
                  <tr key={m.memberId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">{m.name}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600">{m.className}</td>
                    <td className="px-6 py-4 text-center font-bold text-green-600 font-mono">{m.presentCount}</td>
                    <td className="px-6 py-4 text-center font-semibold text-indigo-600 font-mono">{m.permissionCount}</td>
                    <td className="px-6 py-4 text-center font-semibold text-amber-600 font-mono">{m.sickCount}</td>
                    <td className="px-6 py-4 text-center font-bold text-red-600 font-mono">{m.absentCount}</td>
                    <td className="px-6 py-4 text-right font-bold font-mono text-slate-900">
                      <div className="flex items-center justify-end gap-2">
                        <span>{m.percentage}%</span>
                        <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              m.percentage >= 80 ? 'bg-green-500' :
                              m.percentage >= 50 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${m.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
