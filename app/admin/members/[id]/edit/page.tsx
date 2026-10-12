import React from 'react';
import { getMemberDetail } from '@/lib/services/memberService';
import MemberForm from '@/components/members/MemberForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AdminEditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getMemberDetail(id);

  if (!member) {
    notFound();
  }

  const initialData = {
    fullName: member.fullName,
    className: member.className,
    gender: member.gender,
    phone: member.phone,
    position: member.position,
    email: member.email,
  };

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
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Edit Data Anggota PMR</h2>
          <p className="text-xs text-slate-500 mt-1">Ubah data anggota, jabatan PMR, atau perbarui email/kata sandi akun login.</p>
        </div>
      </div>

      <MemberForm mode="edit" id={id} initialData={initialData} />
    </div>
  );
}
