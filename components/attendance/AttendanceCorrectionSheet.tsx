'use client';

import React, { useState, useTransition } from 'react';
import { saveOrUpdateAttendanceAction } from '@/lib/services/attendanceService';
import { Check, Info, FileSpreadsheet, Smile, Clock, User, AlertCircle, Search, Sparkles } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Member {
  id: string;
  fullName: string;
  className: string;
}

interface Attendance {
  id: string;
  memberId: string;
  activityId: string;
  status: 'PRESENT' | 'PERMISSION' | 'SICK' | 'ABSENT';
  checkIn: string | null;
  note: string;
}

export default function AttendanceCorrectionSheet({
  activity,
  members,
  initialAttendances,
}: {
  activity: Activity;
  members: Member[];
  initialAttendances: Attendance[];
}) {
  const [attendances, setAttendances] = useState<Attendance[]>(initialAttendances);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  // Active inputs states for custom correction note
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  // Unique classes for filter
  const classes = Array.from(new Set(members.map(m => m.className))).sort();

  const getMemberStatus = (memberId: string) => {
    const record = attendances.find(att => att.memberId === memberId);
    return record?.status || 'ABSENT'; // Default is ABSENT/Alpa if unrecorded for completed activities
  };

  const getMemberRecord = (memberId: string) => {
    return attendances.find(att => att.memberId === memberId);
  };

  const handleUpdateStatus = (memberId: string, newStatus: 'PRESENT' | 'PERMISSION' | 'SICK' | 'ABSENT') => {
    const existing = getMemberRecord(memberId);
    const customNote = editingNotes[memberId] || '';

    startTransition(async () => {
      try {
        const payload = {
          id: existing?.id, // If it exists, we send ID to update
          memberId,
          activityId: activity.id,
          status: newStatus,
          note: customNote || (newStatus === 'PRESENT' ? 'Hadir dikonfirmasi admin' : ''),
        };

        const res = await saveOrUpdateAttendanceAction(payload);
        if (res.success && res.attendance) {
          setAttendances(prev => {
            const idx = prev.findIndex(a => a.memberId === memberId);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = res.attendance as any;
              return updated;
            } else {
              return [...prev, res.attendance as any];
            }
          });
        }
      } catch (err: any) {
        alert(err.message || 'Gagal mengubah status absensi.');
      }
    });
  };

  const handleNoteChange = (memberId: string, value: string) => {
    setEditingNotes(prev => ({ ...prev, [memberId]: value }));
  };

  // Stats calculation
  const stats = members.reduce(
    (acc, m) => {
      const status = getMemberStatus(m.id);
      if (status === 'PRESENT') acc.present++;
      else if (status === 'PERMISSION') acc.permission++;
      else if (status === 'SICK') acc.sick++;
      else if (status === 'ABSENT') acc.absent++;
      return acc;
    },
    { present: 0, permission: 0, sick: 0, absent: 0 }
  );

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === '' || m.className === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Activity Details Banner */}
      <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Sedang Mengelola Absensi</span>
          <h3 className="text-base font-bold text-white mt-1">{activity.title}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            <span className="mx-2">·</span>
            {activity.startTime} - {activity.endTime} WIB
          </p>
        </div>

        {/* Live counter stats grid */}
        <div className="grid grid-cols-4 gap-2 text-center min-w-[260px]">
          <div className="bg-slate-950/50 p-2 rounded-xl">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Hadir</span>
            <span className="text-sm font-bold text-green-500 font-mono">{stats.present}</span>
          </div>
          <div className="bg-slate-950/50 p-2 rounded-xl">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Izin</span>
            <span className="text-sm font-bold text-indigo-400 font-mono">{stats.permission}</span>
          </div>
          <div className="bg-slate-950/50 p-2 rounded-xl">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Sakit</span>
            <span className="text-sm font-bold text-amber-500 font-mono">{stats.sick}</span>
          </div>
          <div className="bg-slate-950/50 p-2 rounded-xl">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Alpa</span>
            <span className="text-sm font-bold text-red-500 font-mono">{stats.absent}</span>
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari anggota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none"
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none"
        >
          <option value="">Semua Kelas</option>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* Attendance correction list table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Anggota</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Status Absensi Saat Ini</th>
                <th className="px-6 py-4">Catatan Absen</th>
                <th className="px-6 py-4 text-right">Koreksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    Tidak ada anggota terdaftar.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const currentStatus = getMemberStatus(member.id);
                  const record = getMemberRecord(member.id);
                  const currentNote = editingNotes[member.id] !== undefined ? editingNotes[member.id] : (record?.note || '');

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{member.fullName}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">{member.className}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          currentStatus === 'PRESENT' ? 'bg-green-50 text-green-700' :
                          currentStatus === 'PERMISSION' ? 'bg-indigo-50 text-indigo-700' :
                          currentStatus === 'SICK' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {currentStatus === 'PRESENT' ? 'Hadir' :
                           currentStatus === 'PERMISSION' ? 'Izin' :
                           currentStatus === 'SICK' ? 'Sakit' :
                           'Alpa'}
                        </span>
                        {record?.checkIn && (
                          <div className="text-[10px] font-mono text-slate-400 mt-1">
                            Lapor: {new Date(record.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={currentNote}
                          onChange={(e) => handleNoteChange(member.id, e.target.value)}
                          placeholder="Tulis alasan jika Izin/Sakit..."
                          disabled={isPending}
                          className="w-44 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(member.id, 'PRESENT')}
                            disabled={isPending || currentStatus === 'PRESENT'}
                            className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-bold rounded transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            Hadir
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(member.id, 'PERMISSION')}
                            disabled={isPending || currentStatus === 'PERMISSION'}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            Izin
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(member.id, 'SICK')}
                            disabled={isPending || currentStatus === 'SICK'}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            Sakit
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(member.id, 'ABSENT')}
                            disabled={isPending || currentStatus === 'ABSENT'}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold rounded transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            Alpa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
