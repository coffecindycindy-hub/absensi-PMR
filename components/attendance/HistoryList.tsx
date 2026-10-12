'use client';

import React, { useState } from 'react';
import { Calendar, Search, Clock, Info, CheckCircle, XCircle } from 'lucide-react';

interface HistoryItem {
  id: string;
  activityId: string;
  status: 'PRESENT' | 'PERMISSION' | 'SICK' | 'ABSENT';
  checkIn: string | null;
  note: string;
  activityTitle: string;
  activityDate: string;
  activityTime: string;
}

export default function HistoryList({ initialHistory }: { initialHistory: HistoryItem[] }) {
  const [history] = useState<HistoryItem[]>(initialHistory);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredHistory = history.filter(item => {
    const matchesStatus = statusFilter === '' || item.status === statusFilter;
    const matchesStartDate = startDate === '' || item.activityDate >= startDate;
    const matchesEndDate = endDate === '' || item.activityDate <= endDate;
    return matchesStatus && matchesStartDate && matchesEndDate;
  });

  const statusLabels = {
    PRESENT: 'Hadir',
    PERMISSION: 'Izin',
    SICK: 'Sakit',
    ABSENT: 'Alpa',
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">Semua Status</option>
              <option value="PRESENT">Hadir</option>
              <option value="PERMISSION">Izin</option>
              <option value="SICK">Sakit</option>
              <option value="ABSENT">Alpa</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Reset filters */}
        {(statusFilter || startDate || endDate) && (
          <button
            onClick={() => {
              setStatusFilter('');
              setStartDate('');
              setEndDate('');
            }}
            className="text-xs font-bold text-red-600 hover:text-red-700 underline shrink-0 mt-4 md:mt-0 self-start cursor-pointer"
          >
            Bersihkan Filter
          </button>
        )}
      </div>

      {/* History table list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Tanggal Pelaksanaan</th>
                <th className="px-6 py-4">Kegiatan PMR</th>
                <th className="px-6 py-4">Status Kehadiran</th>
                <th className="px-6 py-4">Waktu Lapor</th>
                <th className="px-6 py-4 text-right">Alasan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-slate-500">Belum ada riwayat absensi</p>
                    <p className="text-slate-400 mt-1">Anda belum pernah mencatatkan kehadiran atau filter tidak cocok.</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-600">
                      {new Date(item.activityDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div>
                        {item.activityTitle}
                        <p className="text-[10px] font-normal text-slate-400 mt-0.5">{item.activityTime} WIB</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        item.status === 'PRESENT' ? 'bg-green-50 text-green-700' :
                        item.status === 'PERMISSION' ? 'bg-indigo-50 text-indigo-700' :
                        item.status === 'SICK' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {statusLabels[item.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {item.checkIn ? (
                        new Date(item.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right italic text-slate-500 max-w-xs truncate font-medium">
                      {item.note ? `"${item.note}"` : <span className="text-slate-400 font-normal">-</span>}
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
