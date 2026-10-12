import React from 'react';
import { getSession } from '@/lib/auth/session';
import ProfileForm from '@/components/profile/ProfileForm';

export default async function MemberProfilePage() {
  const session = await getSession();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-950 tracking-tight">Profil Saya</h2>
        <p className="text-xs text-slate-500 mt-1">Perbarui nama lengkap, email, atau ubah kata sandi masuk kesiswaan PMR Anda.</p>
      </div>

      <ProfileForm
        initialName={session?.name || ''}
        initialEmail={session?.email || ''}
      />
    </div>
  );
}
