import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PMR Attendance — SMK Muhammadiyah 1 PPU',
  description: 'Sistem Manajemen dan Absensi Ekstrakurikuler PMR SMK Muhammadiyah 1 Penajam Paser Utara',
  openGraph: {
    title: 'PMR Attendance — SMK Muhammadiyah 1 PPU',
    description: 'Sistem Manajemen dan Absensi Ekstrakurikuler PMR SMK Muhammadiyah 1 Penajam Paser Utara',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PMR Attendance — SMK Muhammadiyah 1 PPU',
    description: 'Sistem Manajemen dan Absensi Ekstrakurikuler PMR SMK Muhammadiyah 1 Penajam Paser Utara',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
