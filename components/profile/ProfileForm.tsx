'use client';

import React, { useState, useTransition } from 'react';
import { updateProfileAction } from '@/lib/services/profileService';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
}

export default function ProfileForm({ initialName, initialEmail }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) return setError('Nama lengkap wajib diisi.');
    if (!email.trim()) return setError('Email wajib diisi.');

    if (password && password.trim() !== '') {
      if (password.length < 4) {
        return setError('Sandi baru minimal terdiri atas 4 karakter.');
      }
      if (password !== confirmPassword) {
        return setError('Konfirmasi sandi baru tidak cocok.');
      }
    }

    startTransition(async () => {
      try {
        const res = await updateProfileAction({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim() || undefined,
        });

        if (res.success) {
          setSuccess('Profil Anda berhasil diperbarui!');
          setPassword('');
          setConfirmPassword('');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memperbarui profil.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 max-w-lg">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-xs text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-100 p-4 text-xs text-green-700 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 text-green-600 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            placeholder="Nama Lengkap Anda"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Alamat Email
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

        {/* Divider */}
        <div className="border-t border-slate-100 pt-5 mt-5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Ubah Kata Sandi (Opsional)</h4>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="passwordHash" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Sandi Baru (Kosongkan jika tidak diubah)
          </label>
          <input
            id="passwordHash"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Konfirmasi Sandi Baru
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="border-t border-slate-100 pt-5 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memperbarui...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Perbarui Profil</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
