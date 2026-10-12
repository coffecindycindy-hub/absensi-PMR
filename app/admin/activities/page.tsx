import React from 'react';
import { getActivitiesList } from '@/lib/services/activityService';
import ActivitiesList from '@/components/activities/ActivitiesList';
import Link from 'next/link';
import { CalendarPlus } from 'lucide-react';

export default async function AdminActivitiesPage() {
  const activities = await getActivitiesList();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Manajemen Kegiatan PMR</h2>
          <p className="text-xs text-slate-500 mt-1">Buat, edit, atau batalkan agenda kegiatan latihan rutin & materi ekstrakurikuler.</p>
        </div>
        <Link
          href="/admin/activities/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Tambah Kegiatan</span>
        </Link>
      </div>

      <ActivitiesList initialActivities={activities} role="ADMIN" />
    </div>
  );
}
