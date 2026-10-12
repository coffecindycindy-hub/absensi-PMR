'use server';

import { db, Member, User } from '@/lib/db/db';
import { getSession } from '../auth/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// Helper to check authorized role (ADMIN or SUPERVISOR can view, but only ADMIN can mutate)
async function requireRole(allowedRoles: ('ADMIN' | 'SUPERVISOR' | 'MEMBER')[], errorMessage = 'Akses ditolak.') {
  const session = await getSession();
  if (!session || !allowedRoles.includes(session.role)) {
    throw new Error(errorMessage);
  }
  return session;
}

export async function getMembersList() {
  await requireRole(['ADMIN', 'SUPERVISOR']);
  return db.getMembers();
}

export async function getMemberDetail(id: string) {
  await requireRole(['ADMIN', 'SUPERVISOR']);
  const member = db.getMemberById(id);
  if (!member) return null;
  
  const user = db.getUserById(member.userId);
  return {
    ...member,
    email: user?.email || '',
  };
}

export async function createMemberAction(formData: {
  fullName: string;
  className: string;
  gender: 'MALE' | 'FEMALE';
  phone: string;
  position: 'CHAIRMAN' | 'VICE_CHAIRMAN' | 'SECRETARY' | 'TREASURER' | 'COORDINATOR' | 'MEMBER';
  email: string;
  password?: string;
}) {
  await requireRole(['ADMIN'], 'Hanya Admin yang dapat menambahkan anggota.');

  const { fullName, className, gender, phone, position, email, password } = formData;

  if (!fullName || !className || !gender || !email) {
    throw new Error('Semua field wajib (Nama, Kelas, Jenis Kelamin, Email) harus diisi.');
  }

  // 1. Check if email already exists
  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email sudah digunakan oleh akun lain.');
  }

  // 3. Create User Account
  const defaultPassword = password || 'member123';
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(defaultPassword, salt);

  const newUser = db.createUser({
    name: fullName,
    email,
    passwordHash,
    role: 'MEMBER',
    status: 'ACTIVE',
  });

  try {
    // 4. Create Member linked to User
    const newMember = db.createMember({
      userId: newUser.id,
      nis: '',
      fullName,
      className,
      gender,
      phone: phone || '',
      position: position || 'MEMBER',
      photoUrl: '',
      status: 'ACTIVE',
    });

    revalidatePath('/admin/members');
    return { success: true, member: newMember };
  } catch (error: any) {
    // Rollback user if member creation fails
    // (In our simplified DB we don't need real transactions but let's be robust)
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === newUser.id);
    if (idx !== -1) {
      users.splice(idx, 1);
    }
    throw new Error(error.message || 'Gagal menambahkan anggota.');
  }
}

export async function updateMemberAction(id: string, formData: {
  fullName: string;
  className: string;
  gender: 'MALE' | 'FEMALE';
  phone: string;
  position: 'CHAIRMAN' | 'VICE_CHAIRMAN' | 'SECRETARY' | 'TREASURER' | 'COORDINATOR' | 'MEMBER';
  email: string;
  password?: string;
}) {
  await requireRole(['ADMIN'], 'Hanya Admin yang dapat mengubah data anggota.');

  const { fullName, className, gender, phone, position, email, password } = formData;

  if (!fullName || !className || !gender || !email) {
    throw new Error('Semua field wajib (Nama, Kelas, Jenis Kelamin, Email) harus diisi.');
  }

  const member = db.getMemberById(id);
  if (!member) {
    throw new Error('Anggota tidak ditemukan.');
  }

  // 1. Update email / password of the user
  const user = db.getUserById(member.userId);
  if (!user) {
    throw new Error('Akun pengguna tidak ditemukan.');
  }

  // Check email conflict
  if (email.toLowerCase() !== user.email.toLowerCase()) {
    const existing = db.getUserByEmail(email);
    if (existing) {
      throw new Error('Email sudah digunakan oleh akun lain.');
    }
    user.email = email;
  }

  user.name = fullName;

  if (password && password.trim() !== '') {
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(password, salt);
  }

  user.updatedAt = new Date().toISOString();

  // 2. Update Member Record
  db.updateMember(id, {
    fullName,
    className,
    gender,
    phone: phone || '',
    position: position || 'MEMBER',
  });

  revalidatePath('/admin/members');
  revalidatePath(`/admin/members/${id}`);
  return { success: true };
}

export async function toggleMemberStatusAction(id: string) {
  await requireRole(['ADMIN'], 'Hanya Admin yang dapat mengubah status anggota.');

  const member = db.getMemberById(id);
  if (!member) {
    throw new Error('Anggota tidak ditemukan.');
  }

  const newStatus = member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  
  // Update member (which automatically syncs corresponding user status in db.updateMember)
  db.updateMember(id, { status: newStatus });

  revalidatePath('/admin/members');
  return { success: true, newStatus };
}
