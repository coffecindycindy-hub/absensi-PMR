'use server';

import { db, Attendance, Attendance as DbAttendance } from '@/lib/db/db';
import { getSession } from '../auth/session';
import { revalidatePath } from 'next/cache';

async function requireRole(allowedRoles: ('ADMIN' | 'SUPERVISOR' | 'MEMBER')[], errorMessage = 'Akses ditolak.') {
  const session = await getSession();
  if (!session || !allowedRoles.includes(session.role)) {
    throw new Error(errorMessage);
  }
  return session;
}

export async function getAttendancesList() {
  await requireRole(['ADMIN', 'SUPERVISOR']);
  return db.getAttendances();
}

export async function getActivityAttendances(activityId: string) {
  await requireRole(['ADMIN', 'SUPERVISOR']);
  const all = db.getAttendances();
  return all.filter(att => att.activityId === activityId);
}

// Submit attendance as a MEMBER (only for self)
export async function submitSelfAttendanceAction(formData: {
  activityId: string;
  status: 'PRESENT' | 'PERMISSION' | 'SICK';
  note?: string;
}) {
  const session = await requireRole(['MEMBER'], 'Hanya Anggota yang dapat melakukan absensi mandiri.');
  
  if (!session.memberId) {
    throw new Error('Akun Anda tidak terhubung dengan profil Anggota.');
  }

  const { activityId, status, note } = formData;

  if (!activityId || !status) {
    throw new Error('Pilih kegiatan dan status absensi.');
  }

  // Double check if activity is valid and exists
  const activity = db.getActivityById(activityId);
  if (!activity) {
    throw new Error('Kegiatan tidak ditemukan.');
  }

  if (activity.status === 'CANCELLED') {
    throw new Error('Kegiatan ini telah dibatalkan.');
  }

  // Create the attendance
  const newAttendance = db.createAttendance({
    memberId: session.memberId,
    activityId,
    status,
    checkIn: status === 'PRESENT' ? new Date().toISOString() : null,
    note: note || '',
  });

  revalidatePath('/member/dashboard');
  revalidatePath('/member/activities');
  revalidatePath('/member/history');
  revalidatePath('/admin/attendance');
  revalidatePath('/supervisor/attendance');
  return { success: true, attendance: newAttendance };
}

// Admin corrections or admin manually recording attendance for a member
export async function saveOrUpdateAttendanceAction(formData: {
  id?: string; // If updating
  memberId: string;
  activityId: string;
  status: 'PRESENT' | 'PERMISSION' | 'SICK' | 'ABSENT';
  note?: string;
}) {
  await requireRole(['ADMIN'], 'Hanya Admin yang dapat mengoreksi data absensi.');

  const { id, memberId, activityId, status, note } = formData;

  if (!memberId || !activityId || !status) {
    throw new Error('Member, Kegiatan, dan Status wajib ditentukan.');
  }

  if (id) {
    // Update existing
    const updated = db.updateAttendance(id, {
      status,
      note: note || '',
      checkIn: status === 'PRESENT' ? new Date().toISOString() : null,
    });
    revalidatePath('/admin/attendance');
    revalidatePath('/supervisor/attendance');
    revalidatePath(`/admin/activities/${activityId}`);
    return { success: true, attendance: updated };
  } else {
    // Create new
    const existing = db.getAttendanceByMemberAndActivity(memberId, activityId);
    if (existing) {
      // If it exists, update it instead
      const updated = db.updateAttendance(existing.id, {
        status,
        note: note || '',
        checkIn: status === 'PRESENT' ? new Date().toISOString() : null,
      });
      revalidatePath('/admin/attendance');
      revalidatePath('/supervisor/attendance');
      revalidatePath(`/admin/activities/${activityId}`);
      return { success: true, attendance: updated };
    }

    const created = db.createAttendance({
      memberId,
      activityId,
      status,
      checkIn: status === 'PRESENT' ? new Date().toISOString() : null,
      note: note || '',
    });
    revalidatePath('/admin/attendance');
    revalidatePath('/supervisor/attendance');
    revalidatePath(`/admin/activities/${activityId}`);
    return { success: true, attendance: created };
  }
}

export async function deleteAttendanceAction(id: string) {
  await requireRole(['ADMIN'], 'Hanya Admin yang dapat menghapus data absensi.');

  db.deleteAttendance(id);
  revalidatePath('/admin/attendance');
  revalidatePath('/supervisor/attendance');
  return { success: true };
}

// Get history for the logged in member (with IDOR protection)
export async function getSelfAttendanceHistory() {
  const session = await requireRole(['MEMBER']);
  if (!session.memberId) {
    throw new Error('Akun Anda tidak terhubung dengan profil Anggota.');
  }

  const allAttendances = db.getAttendances();
  const myAttendances = allAttendances.filter(att => att.memberId === session.memberId);
  
  // Map activity names
  const activities = db.getActivities();
  const historyWithActivity = myAttendances.map(att => {
    const act = activities.find(a => a.id === att.activityId);
    return {
      ...att,
      activityTitle: act?.title || 'Kegiatan Terhapus',
      activityDate: act?.date || '',
      activityTime: act ? `${act.startTime} - ${act.endTime}` : '',
    };
  });

  // Sort by activity date descending
  return historyWithActivity.sort((a, b) => b.activityDate.localeCompare(a.activityDate));
}
