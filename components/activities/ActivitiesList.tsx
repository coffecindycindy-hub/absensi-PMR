'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { deleteActivityAction } from '@/lib/services/activityService';
import { Calendar, Search, Edit3, Trash2, Info, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export default function ActivitiesList({
  initialActivities,
  role = 'MEMBER',
}: {
  initialActivities: Activity[];
  role?: 'ADMIN' | 'SUPERVISOR' | 'MEMBER';
}) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    if (role !== 'ADMIN') return;

    if (confirm(`Apakah Anda yakin ingin menghapus kegiatan "${title}"? Tindakan ini juga akan menghapus data absensi terkait!`)) {
      startTransition(async () => {
        try {
          const res = await deleteActivityAction(id);
          if (res.success) {
            setActivities(prev => prev.filter(act => act.id !== id));
          }
        } catch (err: any) {
          alert(err.message || 'Gagal menghapus kegiatan.');
        }
      });
    }
  };

  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || act.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort activities by date descending
  const sortedActivities = [...filteredActivities].sort((a, b) => b.date.localeCompare(a.date));

  // Check if activity is today and can be checked in by member
  const isToday = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return dateStr === todayStr;
  };

  const statusLabels = {
    UPCOMING: 'Akan Datang',
    ONGOING: 'Sedang Berjalan',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };

  const statusColors = {
    UPCOMING: 'text-amber-600',
    ONGOING: 'text-blue-600 font-bold',
    COMPLETED: 'text-green-600',
    CANCELLED: 'text-slate-400',
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama kegiatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
        >
          <option value="">Semua Status</option>
          <option value="UPCOMING">Akan Datang</option>
          <option value="ONGOING">Sedang Berjalan</option>
          <option value="COMPLETED">Selesai</option>
          <option value="CANCELLED">Dibatalkan</option>
        </select>
      </div>

      {/* Activities Grid */}
      {sortedActivities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 max-w-md mx-auto shadow-sm">
          <Calendar className="w-12 h-12 stroke-1 mx-auto mb-3 text-slate-300" />
          <h4 className="font-bold text-slate-700 text-sm">Tidak Ada Kegiatan</h4>
          <p className="text-xs text-slate-500 mt-1">Belum ada kegiatan yang sesuai dengan pencarian atau filter Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedActivities.map((act) => {
            const today = isToday(act.date);
            return (
              <div
                key={act.id}
                className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                  today && act.status !== 'CANCELLED' ? 'ring-1 ring-red-500/20 bg-red-50/10' : ''
                }`}
              >
                <div className="space-y-2.5">
                  {/* Top line with status indicator (Anti-Pill style - clean text with separators) */}
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={statusColors[act.status]}>
                      ● {statusLabels[act.status]}
                    </span>
                    {today && act.status !== 'CANCELLED' && (
                      <span className="text-red-600 font-bold uppercase tracking-wider text-[9px] animate-pulse">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{act.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed truncate-2-lines">
                      {act.description || 'Tidak ada deskripsi kegiatan.'}
                    </p>
                  </div>

                  {/* Metadata (No pills, quiet inline text with dot separator) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{new Date(act.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>·</span>
                    <span>{act.startTime} - {act.endTime} WIB</span>
                  </div>
                </div>

                {/* Actions bottom bar */}
                <div className="border-t border-slate-50 pt-4 mt-5 flex items-center justify-between">
                  {role === 'ADMIN' ? (
                    <div className="flex items-center gap-2 w-full justify-end">
                      <Link
                        href={`/admin/activities/${act.id}/edit`}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                        title="Edit Kegiatan"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(act.id, act.title)}
                        disabled={isPending}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Hapus Kegiatan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : role === 'MEMBER' && today && (act.status === 'ONGOING' || act.status === 'UPCOMING') ? (
                    <Link
                      href="/member/dashboard"
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Lapor Absensi Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 italic">
                      {role === 'SUPERVISOR' ? 'Pembina Monitoring' : 'Riwayat Kegiatan'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
