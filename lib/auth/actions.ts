'use server';

import { db } from '@/lib/db/db';
import { createSession, destroySession } from './session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export interface ActionResponse {
  success: boolean;
  message: string;
}

export async function loginAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, message: 'Email dan password harus diisi.' };
  }

  try {
    const user = db.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'Email atau password salah.' };
    }

    if (user.status !== 'ACTIVE') {
      return { success: false, message: 'Akun Anda dinonaktifkan. Silakan hubungi admin.' };
    }

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, message: 'Email atau password salah.' };
    }

    // If user is a MEMBER, get their corresponding memberId
    let memberId: string | undefined = undefined;
    if (user.role === 'MEMBER') {
      const member = db.getMemberByUserId(user.id);
      if (!member) {
        return { success: false, message: 'Akun anggota belum dikonfigurasi lengkap oleh admin.' };
      }
      if (member.status !== 'ACTIVE') {
        return { success: false, message: 'Keanggotaan Anda dinonaktifkan. Silakan hubungi admin.' };
      }
      memberId = member.id;
    }

    await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberId,
    });

    return { success: true, message: 'Login berhasil.' };
  } catch (e: any) {
    console.error('Login action error', e);
    return { success: false, message: e.message || 'Terjadi kesalahan sistem.' };
  }
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
