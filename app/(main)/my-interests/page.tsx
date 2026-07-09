'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, Avatar, Badge, Button } from '@/components/ui';
import { MapPin, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '@/lib/utils/formatters';
import { FitScoreBadge } from '@/components/features';

export default function MyInterestsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [swipes, setSwipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchSwipes = async () => {
      try {
        const response = await fetch(`/api/swipes?role=provider`);
        const data = await response.json();
        // Filter only right swipes
        setSwipes(data.filter((s: any) => s.direction === 'right'));
      } catch (error) {
        console.error('Failed to fetch swipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSwipes();
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
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">My Interests</h1>
        <p className="text-sm text-gray-text mt-1">
          Requests you have swiped right on
        </p>
      </div>

      {swipes.length === 0 ? (
        <Card className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-text mb-4">
            You haven't shown interest in any requests yet
          </p>
          <Button onClick={() => router.push('/discover')}>
            Start Discovering
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {swipes.map((swipe) => {
            const request = swipe.targetRequest;
            if (!request) return null;

            return (
              <Card key={swipe.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {request.title}
                  </h3>
                  <FitScoreBadge score={swipe.fitScore} size="sm" />
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {request.description}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-text">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatPrice(request.budget)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatRelativeTime(swipe.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {JSON.parse(request.skills || '[]').map((skill: string) => (
                    <Badge key={skill} variant="primary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-border text-sm">
                  <span className="text-gray-text">Posted by: </span>
                  <span className="font-medium">{request.client?.name}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
