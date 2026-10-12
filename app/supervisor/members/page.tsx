import React from 'react';
import { getMembersList } from '@/lib/services/memberService';
import MembersList from '@/components/members/MembersList';

export default async function SupervisorMembersPage() {
  const members = await getMembersList();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-950 tracking-tight">Daftar Anggota PMR</h2>
        <p className="text-xs text-slate-500 mt-1">Pemantauan daftar anggota PMR aktif, kelas, dan jabatan saat ini.</p>
      </div>

      <MembersList initialMembers={members} isAdmin={false} />
    </div>
  );
}
