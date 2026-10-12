import React from 'react';
import ActivityForm from '@/components/activities/ActivityForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminNewActivityPage() {
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
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Buat Kegiatan PMR Baru</h2>
          <p className="text-xs text-slate-500 mt-1">Daftarkan materi latihan baru atau agenda kesiswaan PMR.</p>
        </div>
      </div>

      <ActivityForm mode="create" />
    </div>
  );
}
