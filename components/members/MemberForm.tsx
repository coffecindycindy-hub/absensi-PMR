'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createMemberAction, updateMemberAction } from '@/lib/services/memberService';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface MemberFormProps {
  mode: 'create' | 'edit';
  id?: string;
  initialData?: {
    fullName: string;
    className: string;
    gender: 'MALE' | 'FEMALE';
    phone: string;
    position: 'CHAIRMAN' | 'VICE_CHAIRMAN' | 'SECRETARY' | 'TREASURER' | 'COORDINATOR' | 'MEMBER';
    email: string;
  };
}

export default function MemberForm({ mode, id, initialData }: MemberFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [className, setClassName] = useState(initialData?.className || '');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>(initialData?.gender || 'MALE');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [position, setPosition] = useState<'CHAIRMAN' | 'VICE_CHAIRMAN' | 'SECRETARY' | 'TREASURER' | 'COORDINATOR' | 'MEMBER'>(initialData?.position || 'MEMBER');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!fullName.trim()) return setError('Nama Lengkap wajib diisi.');
    if (!className.trim()) return setError('Kelas wajib diisi.');
    if (!email.trim()) return setError('Email wajib diisi.');
    if (mode === 'create' && !email.includes('@')) return setError('Email tidak valid.');

    startTransition(async () => {
      try {
        const payload = {
          fullName: fullName.trim(),
          className: className.trim(),
          gender,
          phone: phone.trim(),
          position,
          email: email.trim().toLowerCase(),
          password: password.trim() || undefined,
        };

        if (mode === 'create') {
          await createMemberAction(payload);
        } else if (mode === 'edit' && id) {
          await updateMemberAction(id, payload);
        }

        router.push('/admin/members');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-xs text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nama Lengkap */}
        <div className="col-span-2">
          <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Lengkap *
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            placeholder="Ahmad Fauzi"
          />
        </div>

        {/* Kelas */}
        <div>
          <label htmlFor="className" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Kelas *
          </label>
          <select
            id="className"
            required
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
          >
            <option value="">Pilih Kelas</option>
            <option value="X AKL">X AKL</option>
            <option value="X TKRO 1">X TKRO 1</option>
            <option value="X TKRO 2">X TKRO 2</option>
            <option value="X TKJ">X TKJ</option>
            <option value="XI RPL">XI RPL</option>
            <option value="XI TKJ">XI TKJ</option>
            <option value="XI TKRO 1">XI TKRO 1</option>
            <option value="XI TKRO 2">XI TKRO 2</option>
            <option value="XI AKL">XI AKL</option>
          </select>
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label htmlFor="gender" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Jenis Kelamin *
          </label>
          <select
            id="gender"
            required
            value={gender}
            onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
          >
            <option value="MALE">Laki-laki</option>
            <option value="FEMALE">Perempuan</option>
          </select>
        </div>

        {/* Nomor HP */}
        <div>
          <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nomor HP / WhatsApp
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            placeholder="08123456789"
          />
        </div>

        {/* Jabatan PMR */}
        <div>
          <label htmlFor="position" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Jabatan PMR *
          </label>
          <select
            id="position"
            required
            value={position}
            onChange={(e) => setPosition(e.target.value as any)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
          >
            <option value="MEMBER">Anggota biasa</option>
            <option value="CHAIRMAN">Ketua</option>
            <option value="VICE_CHAIRMAN">Wakil Ketua</option>
            <option value="SECRETARY">Sekretaris</option>
            <option value="TREASURER">Bendahara</option>
            <option value="COORDINATOR">Koordinator</option>
          </select>
        </div>

        {/* Spacer / divider line */}
        <div className="col-span-2 border-t border-slate-100 my-2" />

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Alamat Email (Akun Login) *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            placeholder="nama@pmr.local"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {mode === 'create' ? 'Kata Sandi *' : 'Kata Sandi Baru (Kosongkan jika tidak diubah)'}
          </label>
          <input
            id="password"
            type="password"
            required={mode === 'create'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            placeholder={mode === 'create' ? 'Minimal 4 karakter (default: member123)' : '••••••••'}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/members"
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Batal</span>
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Anggota</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
