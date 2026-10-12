import React from 'react';
import { getActivitiesList } from '@/lib/services/activityService';
import ActivitiesList from '@/components/activities/ActivitiesList';

export default async function SupervisorActivitiesPage() {
  const activities = await getActivitiesList();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-950 tracking-tight">Daftar Kegiatan PMR</h2>
        <p className="text-xs text-slate-500 mt-1">Pemantauan riwayat kegiatan latihan rutin, sosialisasi, dan materi PMR saat ini.</p>
      </div>

      <ActivitiesList initialActivities={activities} role="SUPERVISOR" />
    </div>
  );
}
