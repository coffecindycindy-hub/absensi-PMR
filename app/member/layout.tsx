import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import MemberShell from '@/components/layout/MemberShell';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'MEMBER') {
    redirect('/');
  }

  return (
    <MemberShell userName={session.name} userEmail={session.email}>
      {children}
    </MemberShell>
  );
}
