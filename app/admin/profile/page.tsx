import React from 'react';
import { getSession } from '@/lib/auth/session';
import ProfileForm from '@/components/profile/ProfileForm';

export default async function AdminProfilePage() {
  const session = await getSession();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-950 tracking-tight">Pengaturan Profil Admin</h2>
        <p className="text-xs text-slate-500 mt-1">Perbarui nama lengkap, alamat email kesiswaan, atau ubah kata sandi sistem Anda.</p>
      </div>

      <ProfileForm
        initialName={session?.name || ''}
        initialEmail={session?.email || ''}
      />
    </div>
  );
}
