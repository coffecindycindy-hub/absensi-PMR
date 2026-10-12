'use server';

import { db, Activity } from '@/lib/db/db';
import { getSession } from '../auth/session';
import { revalidatePath } from 'next/cache';

async function requireRole(allowedRoles: ('ADMIN' | 'SUPERVISOR' | 'MEMBER')[], errorMessage = 'Akses ditolak.') {
  const session = await getSession();
  if (!session || !allowedRoles.includes(session.role)) {
    throw new Error(errorMessage);
  }
  return session;
}

export async function getActivitiesList() {
  await requireRole(['ADMIN', 'SUPERVISOR', 'MEMBER']);
  return db.getActivities();
}

export async function getActivityDetail(id: string) {
  await requireRole(['ADMIN', 'SUPERVISOR', 'MEMBER']);
  const activity = db.getActivityById(id);
  if (!activity) return null;
  return activity;
}

export async function createActivityAction(formData: {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}) {
  const session = await requireRole(['ADMIN'], 'Hanya Admin yang dapat membuat kegiatan.');

  const { title, description, date, startTime, endTime, status } = formData;

  if (!title || !date || !startTime || !endTime) {
    throw new Error('Semua field wajib (Judul, Tanggal, Jam Mulai, Jam Selesai) harus diisi.');
  }

  const newActivity = db.createActivity({
    title,
    description: description || '',
    date,
    startTime,
    endTime,
    status: status || 'UPCOMING',
    createdBy: session.userId,
  });

  revalidatePath('/admin/activities');
  revalidatePath('/member/dashboard');
  revalidatePath('/member/activities');
  return { success: true, activity: newActivity };
}

export async function updateActivityAction(id: string, formData: {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}) {
  await requireRole(['ADMIN'], 'Hanya Admin yang dapat mengubah kegiatan.');

  const { title, description, date, startTime, endTime, status } = formData;

  if (!title || !date || !startTime || !endTime || !status) {
    throw new Error('Semua field wajib harus diisi.');
  }

  const updatedActivity = db.updateActivity(id, {
    title,
    description: description || '',
    date,
    startTime,
    endTime,
    status,
  });

  revalidatePath('/admin/activities');
  revalidatePath(`/admin/activities/${id}`);
  revalidatePath('/member/dashboard');
  revalidatePath('/member/activities');
  return { success: true, activity: updatedActivity };
}

export async function deleteActivityAction(id: string) {
  await requireRole(['ADMIN'], 'Hanya Admin yang dapat menghapus kegiatan.');

  db.deleteActivity(id);

  revalidatePath('/admin/activities');
  revalidatePath('/member/dashboard');
  revalidatePath('/member/activities');
  return { success: true };
}
