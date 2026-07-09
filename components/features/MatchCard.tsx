'use client';

import React from 'react';
import { MapPin, Star, Clock, DollarSign, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Avatar, Badge, Button, Card } from '@/components/ui';
import { formatPrice } from '@/lib/utils/formatters';
import { FitScoreBadge } from './FitScoreBadge';

interface MatchCardProps {
  match: any;
  perspective: 'client' | 'provider';
  onMessage?: () => void;
}

export function MatchCard({ match, perspective, onMessage }: MatchCardProps) {
  const otherUser =
    perspective === 'client' ? match.provider : match.client;
  const fitScore =
    perspective === 'client' ? match.clientFitScore : match.providerFitScore;

  return (
    <Card className="mb-3">
      <div className="flex items-start gap-3">
        <Avatar
          src={otherUser?.profile?.photoUrl}
          name={otherUser?.name || 'User'}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser?.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-text mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{otherUser?.location}</span>
              </div>
            </div>
            {fitScore && <FitScoreBadge score={fitScore} size="sm" />}
          </div>

          {perspective === 'client' && otherUser?.profile && (
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">
                  {otherUser.profile.rating?.toFixed(1)}
                </span>
                <span className="text-gray-text">
                  ({otherUser.profile.reviewCount})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-text" />
                <span>{formatPrice(otherUser.profile.price || 0)}</span>
              </div>
            </div>
          )}

          {match.request && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Request:</span> {match.request.title}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3">
            <Badge
              variant={
                match.status === 'mutual'
                  ? 'success'
                  : match.status === 'provider_interested'
                    ? 'primary'
                    : 'warning'
              }
            >
              {match.status.replace('_', ' ')}
            </Badge>
            {match.conversationId && (
              <Button size="sm" variant="outline" onClick={onMessage}>
                <MessageSquare className="w-4 h-4 mr-1" />
                Message
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
