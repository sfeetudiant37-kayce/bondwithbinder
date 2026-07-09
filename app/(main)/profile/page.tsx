'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, Avatar, Badge, Button, Input, ProgressBar } from '@/components/ui';
import { RatingStars } from '@/components/features';
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  Edit2,
  Briefcase,
  Users,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils/formatters';
import { useUserStore } from '@/lib/stores/userStore';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { activeRole, setLanguage, setActiveRole } = useUserStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Profile Header */}
      <Card className="p-6 text-center mb-4">
        <Avatar
          src={user?.profile?.photoUrl}
          name={user?.name || 'User'}
          size="xl"
        />
        <h1 className="text-xl font-semibold text-gray-900 mt-3">
          {user?.name}
        </h1>
        <div className="flex items-center justify-center gap-1 text-sm text-gray-text mt-1">
          <MapPin className="w-4 h-4" />
          <span>{user?.location}</span>
        </div>

        {/* Profile Completion */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-text">Profile completion</span>
            <span className="font-medium text-primary">
              {user?.profileCompletion || 30}%
            </span>
          </div>
          <ProgressBar value={user?.profileCompletion || 30} />
        </div>

        {/* Current Role */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setActiveRole('client')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeRole === 'client'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Client
          </button>
          <button
            onClick={() => setActiveRole('provider')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeRole === 'provider'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Provider
          </button>
        </div>
      </Card>

      {/* Provider Stats */}
      {activeRole === 'provider' && user?.profile && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Provider Stats</h2>
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-primary flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-xl font-bold text-gray-900">
                  {user.profile.rating?.toFixed(1) || '0.0'}
                </span>
              </div>
              <p className="text-xs text-gray-text">Rating</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {user.profile.reviewCount || 0}
              </div>
              <p className="text-xs text-gray-text">Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {user.profile.experience || 0}
              </div>
              <p className="text-xs text-gray-text">Years Exp.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-gray-text" />
              <span>{formatPrice(user.profile.price || 0)}/service</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-text" />
              <Badge variant="success" size="sm">
                {user.profile.availability?.replace('_', ' ') || 'flexible'}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Bio */}
      {user?.profile?.bio && (
        <Card className="p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-2">About</h3>
          <p className="text-sm text-gray-600">{user.profile.bio}</p>
        </Card>
      )}

      {/* Skills */}
      {user?.profile?.skills && (
        <Card className="p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {JSON.parse(user.profile.skills || '[]').map((skill: string) => (
              <Badge key={skill} variant="primary">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Preferences */}
      {user?.profile?.preferences && (
        <Card className="p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Looking For</h3>
          <div className="flex flex-wrap gap-2">
            {JSON.parse(user.profile.preferences || '[]').map((pref: string) => (
              <Badge key={pref} variant="gray">
                {pref}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Contact */}
      <Card className="p-4 mb-4">
        <h3 className="font-medium text-gray-900 mb-3">Contact</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="text-gray-text">Email: </span>
            {user?.email}
          </p>
          {user?.phone && (
            <p>
              <span className="text-gray-text">Phone: </span>
              {user.phone}
            </p>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/settings')}
        >
          Settings
        </Button>
      </div>
    </div>
  );
}
