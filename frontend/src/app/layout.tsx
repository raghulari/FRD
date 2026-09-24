import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FRD Engine — Technical Specification Generator',
  description: 'Production-grade Functional Requirement Document Generator Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased selection:bg-cobalt selection:text-white">
        {children}
      </body>
    </html>
  );
}
