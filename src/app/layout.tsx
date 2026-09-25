import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { BackToTop } from '@/components/BackToTop';

export const metadata: Metadata = {
  title: 'Creanote - Notes from the Creative Journey',
  description:
    'If you create, then you belong here. Creanote is a space for creatives to share raw struggles, lessons, quotes, and notes from their journey.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}<BackToTop /></body>
    </html>
  );
}
