import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IG DM Intelligence API',
  description: 'Scale your Coach & Consultant outreach with precision.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
