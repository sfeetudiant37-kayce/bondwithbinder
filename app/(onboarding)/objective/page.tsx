'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, Button } from '@/components/ui';
import {
  Briefcase,
  PackageSearch,
  Repeat,
  Target,
  Users,
  Wrench,
} from 'lucide-react';

const objectives = [
  {
    id: 'find_service',
    label: 'Find Service Providers',
    description: 'Hire professionals for tasks',
    icon: PackageSearch,
  },
  {
    id: 'offer_service',
    label: 'Offer My Services',
    description: 'Get discovered by clients',
    icon: Wrench,
  },
  {
    id: 'both',
    label: 'Both',
    description: 'Find and offer services flexibly',
    icon: Repeat,
  },
];

export default function ObjectivePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected || !session?.user?.id) return;

    setLoading(true);
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeRole: selected === 'offer_service' ? 'provider' : 'client',
          profile: { objective: selected },
        }),
      });

      // Update the user's profile with objective
      await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective: selected }),
      });

      router.push('/onboarding/preferences');
    } catch (error) {
      console.error('Failed to save objective:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          What brings you here?
        </h2>
        <p className="text-gray-text text-sm">
          Select your primary objective on Binder
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {objectives.map((obj) => {
          const Icon = obj.icon;
          const isSelected = selected === obj.id;

          return (
            <button
              key={obj.id}
              onClick={() => setSelected(obj.id)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary-light'
                  : 'border-gray-border hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      isSelected ? 'text-primary-dark' : 'text-gray-900'
                    }`}
                  >
                    {obj.label}
                  </p>
                  <p className="text-sm text-gray-text">{obj.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full mb-3"
        loading={loading}
      >
        Continue
      </Button>

      <Button variant="ghost" onClick={handleSkip} className="w-full">
        Skip for now
      </Button>
    </Card>
  );
}
