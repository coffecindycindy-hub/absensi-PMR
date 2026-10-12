import React from 'react';
import { getMembersList } from '@/lib/services/memberService';
import MembersList from '@/components/members/MembersList';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default async function AdminMembersPage() {
  const members = await getMembersList();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Manajemen Anggota PMR</h2>
          <p className="text-xs text-slate-500 mt-1">Kelola data anggota, kelas, jabatan, dan status keanggotaan aktif.</p>
        </div>
        <Link
          href="/admin/members/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Anggota</span>
        </Link>
      </div>

      <MembersList initialMembers={members} isAdmin={true} />
    </div>
  );
}
