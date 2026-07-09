'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, Avatar, Badge, Button } from '@/components/ui';
import { MatchCard } from '@/components/features';
import { useUserStore } from '@/lib/stores/userStore';
import { MessageSquare, User, UserCheck } from 'lucide-react';

interface Match {
  id: string;
  clientId: string;
  providerId: string;
  client: any;
  provider: any;
  status: string;
  clientFitScore: number;
  providerFitScore: number | null;
  conversation?: any;
  createdAt: string;
}

export default function MatchesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { activeRole } = useUserStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [session, router]);

  const handleMessage = (match: Match) => {
    if (match.conversation?.id) {
      router.push(`/messages/${match.conversation.id}`);
    } else {
      router.push(`/messages?matchId=${match.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  const mutualMatches = matches.filter((m) => m.status === 'mutual');
  const pendingMatches = matches.filter(
    (m) =>
      m.status !== 'mutual' &&
      ((activeRole === 'client' && m.status === 'provider_interested') ||
        (activeRole === 'provider' && m.status === 'client_interested'))
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Matches</h1>
        <p className="text-sm text-gray-text mt-1">
          Your connections with other users
        </p>
      </div>

      {matches.length === 0 ? (
        <Card className="text-center py-8">
          <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-text mb-4">No matches yet</p>
          <Button onClick={() => router.push('/discover')}>
            Start Discovering
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Mutual Matches */}
          {mutualMatches.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-3">
                Active Matches ({mutualMatches.length})
              </h2>
              <div className="space-y-3">
                {mutualMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    perspective={
                      match.clientId === session?.user?.id ? 'client' : 'provider'
                    }
                    onMessage={() => handleMessage(match)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pending Matches */}
          {pendingMatches.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-3">
                Pending ({pendingMatches.length})
              </h2>
              <div className="space-y-3">
                {pendingMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    perspective={
                      match.clientId === session?.user?.id ? 'client' : 'provider'
                    }
                    onMessage={() => handleMessage(match)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
