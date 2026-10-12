'use client';

import React, { useState, useTransition } from 'react';
import { submitSelfAttendanceAction } from '@/lib/services/attendanceService';
import { Check, CheckCircle, FileSpreadsheet, Smile, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AttendanceCardProps {
  activityId: string;
  activityTitle: string;
  initialStatus: 'NOT_SUBMITTED' | 'PRESENT' | 'PERMISSION' | 'SICK' | 'ABSENT';
  initialTime: string | null;
}

export default function AttendanceCard({
  activityId,
  activityTitle,
  initialStatus,
  initialTime,
}: AttendanceCardProps) {
  const [status, setStatus] = useState<'NOT_SUBMITTED' | 'PRESENT' | 'PERMISSION' | 'SICK' | 'ABSENT'>(initialStatus);
  const [checkInTime, setCheckInTime] = useState<string | null>(initialTime);
  const [selectedOption, setSelectedOption] = useState<'PRESENT' | 'PERMISSION' | 'SICK' | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelectStatus = (opt: 'PRESENT' | 'PERMISSION' | 'SICK') => {
    setSelectedOption(opt);
    setError(null);
  };

  const handleConfirmSubmit = () => {
    if (!selectedOption) {
      setError('Silakan pilih salah satu status kehadiran.');
      return;
    }
    setShowConfirm(true);
  };

  const executeSubmit = () => {
    if (!selectedOption) return;
    setError(null);

    startTransition(async () => {
      try {
        const response = await submitSelfAttendanceAction({
          activityId,
          status: selectedOption,
          note: note.trim(),
        });

        if (response.success) {
          setStatus(selectedOption);
          if (selectedOption === 'PRESENT') {
            const now = new Date();
            setCheckInTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
          }
          setShowConfirm(false);
        }
      } catch (err: any) {
        setError(err.message || 'Gagal menyimpan absensi.');
        setShowConfirm(false);
      }
    });
  };

  // Status mapping to Bahasa Indonesia
  const statusLabels = {
    PRESENT: 'Hadir',
    PERMISSION: 'Izin',
    SICK: 'Sakit',
    ABSENT: 'Alpa',
    NOT_SUBMITTED: 'Belum Absen',
  };

  if (status !== 'NOT_SUBMITTED') {
    return (
      <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex flex-col items-center text-center">
        <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-green-900 text-base">Absensi Berhasil Dicatat!</h4>
        <p className="text-xs text-green-700 mt-1 max-w-xs">
          Anda telah melaporkan kehadiran dengan status <span className="font-bold">{statusLabels[status]}</span> untuk kegiatan: <br />
          <span className="font-semibold italic">&quot;{activityTitle}&quot;</span>
        </p>
        {checkInTime && (
          <p className="text-xs font-mono text-green-600 mt-2">
            Waktu Lapor: {checkInTime} WIB
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Select buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleSelectStatus('PRESENT')}
          disabled={isPending}
          className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
            selectedOption === 'PRESENT'
              ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Smile className={`w-5 h-5 ${selectedOption === 'PRESENT' ? 'text-green-600' : 'text-slate-400'}`} />
          <span className="text-xs font-bold">Hadir</span>
        </button>

        <button
          onClick={() => handleSelectStatus('PERMISSION')}
          disabled={isPending}
          className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
            selectedOption === 'PERMISSION'
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          <FileSpreadsheet className={`w-5 h-5 ${selectedOption === 'PERMISSION' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span className="text-xs font-bold">Izin</span>
        </button>

        <button
          onClick={() => handleSelectStatus('SICK')}
          disabled={isPending}
          className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
            selectedOption === 'SICK'
              ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Info className={`w-5 h-5 ${selectedOption === 'SICK' ? 'text-amber-600' : 'text-slate-400'}`} />
          <span className="text-xs font-bold">Sakit</span>
        </button>
      </div>

      {/* Optional Note input */}
      <div>
        <label htmlFor="note" className="block text-xs font-bold text-slate-600 mb-1">
          Catatan Tambahan (Opsional)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: Sakit flu / Mengikuti olimpiade"
          disabled={isPending}
          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
        />
      </div>

      {/* Submit CTA */}
      <button
        onClick={handleConfirmSubmit}
        disabled={isPending || !selectedOption}
        className="w-full flex justify-center py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-200 hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none cursor-pointer"
      >
        Lapor Absensi
      </button>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 text-center border border-slate-100"
            >
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Absensi</h3>
              <p className="text-xs text-slate-600">
                Apakah Anda yakin ingin mencatat status <span className="font-bold text-red-600">
                  {selectedOption ? statusLabels[selectedOption] : ''}
                </span> untuk kegiatan ini?
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="flex-1 py-2 px-3 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={executeSubmit}
                  disabled={isPending}
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Proses...
                    </>
                  ) : (
                    'Ya, Kirim'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
