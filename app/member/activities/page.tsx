import React from 'react';
import { getActivitiesList } from '@/lib/services/activityService';
import ActivitiesList from '@/components/activities/ActivitiesList';

export default async function MemberActivitiesPage() {
  const activities = await getActivitiesList();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-950 tracking-tight">Agenda Kegiatan PMR</h2>
        <p className="text-xs text-slate-500 mt-1">Lihat jadwal kegiatan latihan rutin, penyampaian materi, dan lakukan pelaporan absensi.</p>
      </div>

      <ActivitiesList initialActivities={activities} role="MEMBER" />
    </div>
  );
}
