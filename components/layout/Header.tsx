'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Bell, Menu, User, LogOut, Settings } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { RoleToggle } from './RoleToggle';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const { unreadCount } = useNotificationStore();
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <Link href="/dashboard">
            <h1 className="text-xl font-bold text-primary">Binder</h1>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {session && <RoleToggle />}

          <Link
            href="/notifications"
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg"
            >
              {session?.user ? (
                <Avatar
                  src={null}
                  name={session.user.name || 'User'}
                  size="sm"
                />
              ) : (
                <User className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-border z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                    onClick={() => setShowMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                    onClick={() => setShowMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="border-gray-border" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      signOut({ callbackUrl: '/login' });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-destructive w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
