'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, Avatar, Badge, Button } from '@/components/ui';
import { FitScoreBadge } from '@/components/features';
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  MessageSquare,
  Phone,
  Mail,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils/formatters';

interface InterestedProvider {
  id: string;
  provider: any;
  providerId: string;
  clientFitScore: number;
  requestId: string;
  request: any;
  createdAt: string;
  conversation?: any;
}

export default function InterestedPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState<InterestedProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/interested');
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        console.error('Failed to fetch interested providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, router]);

  const handleMessage = async (match: InterestedProvider) => {
    // Check if conversation exists, otherwise go to messages with matchId
    if (match.conversation?.id) {
      router.push(`/messages?conversation=${match.conversation.id}`);
    } else {
      // Provider swiped right, create conversation if doesn't exist
      router.push(`/messages?provider=${match.providerId}`);
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

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
        <h1 className="text-xl font-semibold text-gray-900">
          Interested Providers
        </h1>
        <p className="text-sm text-gray-text mt-1">
          Providers who want to work with you, ranked by FitScore. Choose freely!
        </p>
      </div>

      {providers.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-text">
            No providers have shown interest yet. Post a request to attract providers!
          </p>
          <Button className="mt-4" onClick={() => router.push('/requests/new')}>
            Post a Request
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {providers.map((match) => {
            const provider = match.provider;
            return (
              <Card key={match.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar
                    src={provider?.profile?.photoUrl}
                    name={provider?.name || 'Provider'}
                    size="lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {provider?.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-text mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{provider?.location}</span>
                        </div>
                      </div>
                      <FitScoreBadge score={match.clientFitScore} />
                    </div>
                  </div>
                </div>

                {provider?.profile && (
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">
                        {provider.profile.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-text">
                        ({provider.profile.reviewCount || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-text" />
                      <span>{formatPrice(provider.profile.price || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-text" />
                      <Badge variant="success" size="sm">
                        {provider.profile.availability?.replace('_', ' ') ||
                          'flexible'}
                      </Badge>
                    </div>
                  </div>
                )}

                {provider?.profile?.bio && (
                  <p className="text-sm text-gray-600 mb-3">{provider.profile.bio}</p>
                )}

                {provider?.profile?.skills && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {JSON.parse(provider.profile.skills || '[]').map(
                      (skill: string) => (
                        <Badge key={skill} variant="primary" size="sm">
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                )}

                {/* Contact Info - Revealed because provider swiped right first */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-800 font-medium mb-2">
                    Contact Information (Provider initiated contact)
                  </p>
                  <div className="space-y-1.5">
                    {provider?.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="w-4 h-4" />
                          <span>{provider.phone}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCall(provider.phone)}
                          >
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsApp(provider.phone)}
                          >
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4" />
                      <span>{provider?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Request reference */}
                {match.request && (
                  <div className="bg-primary-light rounded-lg p-2 mb-4">
                    <p className="text-xs text-primary-dark font-medium">
                      For your request: {match.request.title}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleMessage(match)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/profile/${provider.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
