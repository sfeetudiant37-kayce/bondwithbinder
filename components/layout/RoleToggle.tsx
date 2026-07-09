'use client';

import React from 'react';
import { useUserStore } from '@/lib/stores/userStore';
import { Briefcase, Users } from 'lucide-react';

export function RoleToggle() {
  const { activeRole, toggleRole } = useUserStore();

  return (
    <button
      onClick={toggleRole}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        activeRole === 'client'
          ? 'bg-primary-light text-primary'
          : 'bg-green-100 text-green-700'
      }`}
    >
      {activeRole === 'client' ? (
        <>
          <Users className="w-4 h-4" />
          Client
        </>
      ) : (
        <>
          <Briefcase className="w-4 h-4" />
          Provider
        </>
      )}
    </button>
  );
}
