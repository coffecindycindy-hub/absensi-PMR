import React from 'react';
import MemberForm from '@/components/members/MemberForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminNewMemberPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/members"
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-950 transition-colors"
          title="Kembali ke Daftar Anggota"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Tambah Anggota PMR Baru</h2>
          <p className="text-xs text-slate-500 mt-1">Isi formulir berikut untuk mendaftarkan anggota baru dan membuat akun loginnya.</p>
        </div>
      </div>

      <MemberForm mode="create" />
    </div>
  );
}
