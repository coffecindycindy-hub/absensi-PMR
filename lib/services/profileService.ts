'use server';

import { db } from '@/lib/db/db';
import { getSession } from '../auth/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(formData: {
  name: string;
  email: string;
  password?: string;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error('Akses ditolak. Silakan login kembali.');
  }

  const { name, email, password } = formData;

  if (!name || !email) {
    throw new Error('Nama dan Email wajib diisi.');
  }

  const user = db.getUserById(session.userId);
  if (!user) {
    throw new Error('Pengguna tidak ditemukan.');
  }

  // Check email conflict
  if (email.toLowerCase() !== user.email.toLowerCase()) {
    const existing = db.getUserByEmail(email);
    if (existing) {
      throw new Error('Email sudah digunakan oleh akun lain.');
    }
    user.email = email;
  }

  user.name = name;

  if (password && password.trim() !== '') {
    if (password.length < 4) {
      throw new Error('Password baru minimal 4 karakter.');
    }
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(password, salt);
  }

  user.updatedAt = new Date().toISOString();

  // If role is MEMBER, also update Member.fullName
  if (session.role === 'MEMBER') {
    const member = db.getMemberByUserId(session.userId);
    if (member) {
      db.updateMember(member.id, { fullName: name });
    }
  }

  // Update session info by clearing and recreating (or user logs in again, or we can update session on next request)
  // To make it easy, we will ask them to relogin if they change email, otherwise we just let them carry on.

  revalidatePath('/admin/profile');
  revalidatePath('/supervisor/profile');
  revalidatePath('/member/profile');
  
  return { success: true };
}
