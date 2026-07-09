'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Card, Button, Badge } from '@/components/ui';
import { Globe, Bell, Moon, LogOut, Trash, ArrowLeft } from 'lucide-react';
import { useUserStore } from '@/lib/stores/userStore';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { language, setLanguage, activeRole, setActiveRole } = useUserStore();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-xl font-semibold text-gray-900 mb-4">Settings</h1>

      {/* Language */}
      <Card className="p-4 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Language</p>
              <p className="text-sm text-gray-text">Choose your language</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                language === 'en'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                language === 'fr'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              French
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-4 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Notifications</p>
              <p className="text-sm text-gray-text">
                Receive push notifications
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-7 rounded-full transition-all ${
              notifications ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Account */}
      <Card className="p-4 mb-3">
        <h2 className="font-medium text-gray-900 mb-3">Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-text">Email</span>
            <span className="text-gray-900">{session?.user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-text">Current Role</span>
            <Badge variant={activeRole === 'client' ? 'primary' : 'success'}>
              {activeRole}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-text">Account Created</span>
            <span className="text-gray-900">Today</span>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-4 mb-6 border-destructive">
        <h2 className="font-medium text-destructive mb-3">Danger Zone</h2>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full text-destructive border-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Card>

      {/* App Info */}
      <div className="text-center text-xs text-gray-text">
        <p>Binder v1.0.0</p>
        <p>Made with care for Cameroon</p>
      </div>
    </div>
  );
}
