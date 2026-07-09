'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import { FitScoreBadge } from '@/components/features';
import { useUserStore } from '@/lib/stores/userStore';
import {
  Star,
  TrendingUp,
  MessageSquare,
  Briefcase,
  Users,
  ArrowRight,
} from 'lucide-react';

interface DashboardData {
  interestedProviders: number;
  activeMatches: number;
  unreadMessages: number;
  stats: {
    asClient: { matches: number; requests: number };
    asProvider: { matches: number; swipes: number };
  };
  topProviders: any[];
  recentMatches: any[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { activeRole } = useUserStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch matches
        const matchesRes = await fetch('/api/matches');
        const matches = await matchesRes.json();

        // Fetch interested providers if client
        let interestedProviders = [];
        if (activeRole === 'client') {
          const interestedRes = await fetch('/api/interested');
          interestedProviders = await interestedRes.json();
        }

        // Get stats
        const clientMatches = matches.filter(
          (m: any) => m.clientId === session?.user?.id
        ).length;
        const providerMatches = matches.filter(
          (m: any) => m.providerId === session?.user?.id
        ).length;

        setData({
          interestedProviders: interestedProviders.length,
          activeMatches: matches.length,
          unreadMessages: 0,
          stats: {
            asClient: { matches: clientMatches, requests: 0 },
            asProvider: { matches: providerMatches, swipes: 0 },
          },
          topProviders: interestedProviders.slice(0, 3),
          recentMatches: matches.slice(0, 3),
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, activeRole, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{session?.user?.name && `, ${session.user.name.split(' ')[0]}`}
        </h1>
        <p className="text-gray-text mt-1">
          {activeRole === 'client'
            ? 'Find service providers for your needs'
            : 'Get discovered by clients'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {data?.interestedProviders || 0}
          </div>
          <p className="text-xs text-gray-text mt-1">Interested</p>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {data?.activeMatches || 0}
          </div>
          <p className="text-xs text-gray-text mt-1">Matches</p>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {data?.unreadMessages || 0}
          </div>
          <p className="text-xs text-gray-text mt-1">Messages</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-light rounded-lg">
            {activeRole === 'client' ? (
              <Users className="w-5 h-5 text-primary" />
            ) : (
              <Briefcase className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {activeRole === 'client'
                ? 'Find Service Providers'
                : 'Find Client Requests'}
            </p>
            <p className="text-sm text-gray-text">
              Start swiping to discover matches
            </p>
          </div>
        </div>
        <Link href="/discover">
          <Button size="sm" variant="outline">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </Card>

      {/* Interested Providers (Client view) */}
      {activeRole === 'client' && data?.topProviders && data.topProviders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Providers Interested</h2>
            <Link
              href="/interested"
              className="text-sm text-primary font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.topProviders.map((match: any) => (
              <Card key={match.id} className="flex items-center gap-3">
                <Avatar
                  src={match.provider?.profile?.photoUrl}
                  name={match.provider?.name || 'Provider'}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {match.provider?.name}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-text">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span>{match.provider?.profile?.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
                <FitScoreBadge score={match.clientFitScore} size="sm" />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Matches */}
      {data?.recentMatches && data.recentMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/matches" className="text-sm text-primary font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentMatches.map((match: any) => {
              const otherUser =
                match.clientId === session?.user?.id
                  ? match.provider
                  : match.client;
              return (
                <Card
                  key={match.id}
                  className="flex items-center gap-3"
                  onClick={() =>
                    router.push(
                      `/messages?conversation=${match.conversation?.id}`
                    )
                  }
                >
                  <Avatar
                    src={otherUser?.profile?.photoUrl}
                    name={otherUser?.name || 'User'}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {otherUser?.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          match.status === 'mutual' ? 'success' : 'primary'
                        }
                      >
                        {match.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <MessageSquare className="w-5 h-5 text-gray-text" />
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!data?.activeMatches && !data?.interestedProviders) && (
        <Card className="text-center py-8">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Get Started</h3>
          <p className="text-sm text-gray-text mb-4">
            {activeRole === 'client'
              ? 'Start browsing providers to find the perfect match'
              : 'Start browsing client requests to find work'}
          </p>
          <Link href="/discover">
            <Button>Start Discovering</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
