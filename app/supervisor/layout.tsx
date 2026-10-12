import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import SupervisorShell from '@/components/layout/SupervisorShell';

export default async function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'SUPERVISOR') {
    redirect('/');
  }

  return (
    <SupervisorShell userName={session.name} userEmail={session.email}>
      {children}
    </SupervisorShell>
  );
}
