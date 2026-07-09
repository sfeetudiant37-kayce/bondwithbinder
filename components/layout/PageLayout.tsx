'use client';

import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface PageLayoutProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
}

export function PageLayout({ children, hideBottomNav = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className={`max-w-lg mx-auto ${hideBottomNav ? '' : 'pb-20'}`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
