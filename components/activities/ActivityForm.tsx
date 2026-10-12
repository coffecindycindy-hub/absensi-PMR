'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createActivityAction, updateActivityAction } from '@/lib/services/activityService';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ActivityFormProps {
  mode: 'create' | 'edit';
  id?: string;
  initialData?: {
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  };
}

export default function ActivityForm({ mode, id, initialData }: ActivityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '15:30');
  const [endTime, setEndTime] = useState(initialData?.endTime || '17:00');
  const [status, setStatus] = useState<'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'>(initialData?.status || 'UPCOMING');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError('Judul kegiatan wajib diisi.');
    if (!date) return setError('Tanggal kegiatan wajib ditentukan.');
    if (!startTime) return setError('Jam mulai kegiatan wajib ditentukan.');
    if (!endTime) return setError('Jam selesai kegiatan wajib ditentukan.');

    // End Time validator
    if (endTime < startTime) {
      return setError('Jam Selesai tidak boleh mendahului Jam Mulai kegiatan.');
    }

    startTransition(async () => {
      try {
        const payload = {
          title: title.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          status,
        };

        if (mode === 'create') {
          await createActivityAction(payload);
        } else if (mode === 'edit' && id) {
          await updateActivityAction(id, payload);
        }

        router.push('/admin/activities');
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

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama / Judul Kegiatan *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            placeholder="Contoh: Latihan Materi Pertolongan Pertama (PP)"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Deskripsi Kegiatan
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 resize-none"
            placeholder="Tulis ringkasan materi, perlengkapan yang perlu dibawa, atau catatan kegiatan lainnya..."
          />
        </div>

        {/* Date, Start Time, End Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tanggal Kegiatan *
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isPending}
              className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="startTime" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jam Mulai *
            </label>
            <input
              id="startTime"
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={isPending}
              className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="endTime" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jam Selesai *
            </label>
            <input
              id="endTime"
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={isPending}
              className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Status (Only on edit mode) */}
        {mode === 'edit' && (
          <div className="w-1/2">
            <label htmlFor="status" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Kegiatan *
            </label>
            <select
              id="status"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              disabled={isPending}
              className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50"
            >
              <option value="UPCOMING">Akan Datang</option>
              <option value="ONGOING">Sedang Berjalan</option>
              <option value="COMPLETED">Selesai (Completed)</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/activities"
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
              <span>Simpan Kegiatan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
