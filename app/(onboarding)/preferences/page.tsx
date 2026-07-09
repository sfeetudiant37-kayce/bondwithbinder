'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, Button, Chip } from '@/components/ui';

const allSkills = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Welding',
  'Tiling',
  'Masonry',
  'Roofing',
  'HVAC',
  'Landscaping',
  'Cleaning',
  'Moving',
  'Tailoring',
  'Catering',
  'Photography',
  'Web Design',
  'Accounting',
  'Translation',
  'Tutoring',
  'Driving',
];

export default function PreferencesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelected((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, skill];
    });
  };

  const handleContinue = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: { preferences: JSON.stringify(selected) },
        }),
      });

      router.push('/onboarding/profile-setup');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          What are you looking for?
        </h2>
        <p className="text-gray-text text-sm">
          Select up to 4 categories ({selected.length}/4 selected)
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {allSkills.map((skill) => {
          const isSelected = selected.includes(skill);
          return (
            <Chip
              key={skill}
              selected={isSelected}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </Chip>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="mb-4 p-3 bg-primary-light rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Selected:</p>
          <div className="flex flex-wrap gap-1">
            {selected.map((skill) => (
              <span key={skill} className="text-sm text-primary font-medium">
                {skill}
                {selected.indexOf(skill) < selected.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleContinue}
        disabled={selected.length === 0}
        className="w-full mb-3"
        loading={loading}
      >
        Continue
      </Button>

      <Button variant="ghost" onClick={() => router.push('/dashboard')} className="w-full">
        Skip
      </Button>
    </Card>
  );
}
