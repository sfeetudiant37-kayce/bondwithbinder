'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Avatar, Badge, Button } from '@/components/ui';
import { RatingStars } from '@/components/features';
import { MapPin, Star, Clock, DollarSign, MessageSquare, ArrowLeft, Phone, Mail } from 'lucide-react';
import { formatPrice } from '@/lib/utils/formatters';

export default function UserProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [session, router, userId]);

  const handleMessage = () => {
    router.push(`/messages?provider=${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-text">User not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

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

        {user?.profile?.rating !== undefined && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <RatingStars rating={user.profile.rating} readonly size="md" />
            <span className="text-sm font-medium">
              {user.profile.rating?.toFixed(1)}
            </span>
            <span className="text-sm text-gray-text">
              ({user.profile.reviewCount || 0} reviews)
            </span>
          </div>
        )}
      </Card>

      {/* Stats */}
      {user?.profile && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {user.profile.experience || 0}
              </div>
              <p className="text-xs text-gray-text">Years Exp.</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {formatPrice(user.profile.price || 0)}
              </div>
              <p className="text-xs text-gray-text">per service</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 capitalize">
                {user.profile.availability?.replace('_', ' ') || 'flexible'}
              </div>
              <p className="text-xs text-gray-text">Available</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-text" />
            <Badge variant="success" size="sm">
              {user.profile.availability?.replace('_', ' ') || 'flexible'}
            </Badge>
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

      {/* Contact */}
      <Card className="p-4 mb-4">
        <h3 className="font-medium text-gray-900 mb-3">Contact</h3>
        <div className="space-y-2 text-sm text-gray-600">
          {user?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Button className="w-full" onClick={handleMessage}>
        <MessageSquare className="w-4 h-4 mr-2" />
        Message {user?.name?.split(' ')[0]}
      </Button>
    </div>
  );
}
