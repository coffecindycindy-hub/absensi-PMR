import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function IndexPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Redirect based on role
  if (session.role === 'ADMIN') {
    redirect('/admin/dashboard');
  } else if (session.role === 'SUPERVISOR') {
    redirect('/supervisor/dashboard');
  } else if (session.role === 'MEMBER') {
    redirect('/member/dashboard');
  }

  redirect('/login');
}
