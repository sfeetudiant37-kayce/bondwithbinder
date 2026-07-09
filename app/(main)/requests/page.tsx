'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Badge, Button } from '@/components/ui';
import { Clock, MapPin, DollarSign, Plus, Users } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '@/lib/utils/formatters';

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  urgency: string;
  skills: string;
  status: string;
  createdAt: string;
  client: any;
}

export default function RequestsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/requests?my=true');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-text mt-1">
            Service requests you have posted
          </p>
        </div>
        <Link href="/requests/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-text mb-4">
            You haven't posted any requests yet
          </p>
          <Link href="/requests/new">
            <Button>Post a Request</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{request.title}</h3>
                <Badge
                  variant={request.status === 'open' ? 'success' : 'warning'}
                >
                  {request.status}
                </Badge>
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
                  <span>{formatRelativeTime(request.createdAt)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {JSON.parse(request.skills || '[]').map((skill: string) => (
                  <Badge key={skill} variant="primary" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-border">
                <Link
                  href={`/interested?requestId=${request.id}`}
                  className="text-sm text-primary font-medium flex items-center gap-1"
                >
                  <Users className="w-4 h-4" />
                  View Interested Providers
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
