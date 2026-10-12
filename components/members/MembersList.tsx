'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { toggleMemberStatusAction } from '@/lib/services/memberService';
import { Search, UserPlus, Edit2, ShieldAlert, Eye, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

interface MemberWithEmail {
  id: string;
  fullName: string;
  className: string;
  gender: 'MALE' | 'FEMALE';
  phone: string;
  position: string;
  status: 'ACTIVE' | 'INACTIVE';
  email?: string;
}

export default function MembersList({
  initialMembers,
  isAdmin = false,
}: {
  initialMembers: MemberWithEmail[];
  isAdmin?: boolean;
}) {
  const [members, setMembers] = useState<MemberWithEmail[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  // Extract unique classes for filter
  const classes = Array.from(new Set(initialMembers.map(m => m.className))).sort();

  const handleToggleStatus = (id: string, currentName: string) => {
    if (!isAdmin) return;
    
    if (confirm(`Apakah Anda yakin ingin mengubah status keanggotaan ${currentName}?`)) {
      startTransition(async () => {
        try {
          const res = await toggleMemberStatusAction(id);
          if (res.success) {
            setMembers(prev =>
              prev.map(m => (m.id === id ? { ...m, status: res.newStatus as 'ACTIVE' | 'INACTIVE' } : m))
            );
          }
        } catch (err: any) {
          alert(err.message || 'Gagal mengubah status anggota.');
        }
      });
    };
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === '' || m.className === classFilter;
    const matchesStatus = statusFilter === '' || m.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Position label translator
  const positionLabels: Record<string, string> = {
    CHAIRMAN: 'Ketua',
    VICE_CHAIRMAN: 'Wakil Ketua',
    SECRETARY: 'Sekretaris',
    TREASURER: 'Bendahara',
    COORDINATOR: 'Koordinator',
    MEMBER: 'Anggota',
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama anggota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            <option value="">Semua Kelas</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            <option value="">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Jabatan PMR</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Info className="w-10 h-10 stroke-1 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-500">Anggota tidak ditemukan</p>
                    <p className="text-slate-400 mt-1">Coba gunakan kata kunci pencarian atau filter yang berbeda.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-950">
                      <div>
                        {member.fullName}
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">{member.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{member.className}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {positionLabels[member.position] || member.position}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        member.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {member.status === 'ACTIVE' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isAdmin ? (
                          <>
                            <Link
                              href={`/admin/members/${member.id}/edit`}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                              title="Edit Anggota"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(member.id, member.fullName)}
                              disabled={isPending}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                                member.status === 'ACTIVE'
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}
                            >
                              {member.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-400 italic font-medium text-[11px]">Pembina</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
