import React from 'react';
import { getActivityDetail } from '@/lib/services/activityService';
import ActivityForm from '@/components/activities/ActivityForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AdminEditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivityDetail(id);

  if (!activity) {
    notFound();
  }

  const initialData = {
    title: activity.title,
    description: activity.description,
    date: activity.date,
    startTime: activity.startTime,
    endTime: activity.endTime,
    status: activity.status,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/activities"
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-950 transition-colors"
          title="Kembali ke Daftar Kegiatan"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Edit Data Kegiatan PMR</h2>
          <p className="text-xs text-slate-500 mt-1">Ubah agenda, jadwal pelaksanaan, atau perbarui status kegiatan.</p>
        </div>
      </div>

      <ActivityForm mode="edit" id={id} initialData={initialData} />
    </div>
  );
}
