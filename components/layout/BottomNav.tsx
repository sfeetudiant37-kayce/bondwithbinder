'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Heart,
  MessageSquare,
  Briefcase,
  User,
  Bell,
  Star,
} from 'lucide-react';
import { useUserStore } from '@/lib/stores/userStore';

const navItems = {
  client: [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/discover', icon: Search, label: 'Discover' },
    { href: '/interested', icon: Star, label: 'Interested' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/profile', icon: User, label: 'Profile' },
  ],
  provider: [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/discover', icon: Search, label: 'Discover' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/profile', icon: User, label: 'Profile' },
  ],
};

export function BottomNav() {
  const pathname = usePathname();
  const { activeRole } = useUserStore();

  const items = navItems[activeRole];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-border z-30 safe-area-padding">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                isActive ? 'text-primary' : 'text-gray-text'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
