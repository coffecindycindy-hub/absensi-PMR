import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/layout/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'ADMIN') {
    // Prevent role-bypass
    redirect('/');
  }

  return (
    <AdminShell userName={session.name} userEmail={session.email}>
      {children}
    </AdminShell>
  );
}
