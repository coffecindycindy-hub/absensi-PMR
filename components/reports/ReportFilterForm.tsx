'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

export default function ReportFilterForm({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    router.push(basePath);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4 text-xs font-sans">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Dari Tanggal
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="endDate" className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Sampai Tanggal
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto">
        {(searchParams.get('startDate') || searchParams.get('endDate')) && (
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-bold cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Atur Ulang</span>
          </button>
        )}
        <button
          type="submit"
          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Saring Laporan</span>
        </button>
      </div>
    </form>
  );
}
