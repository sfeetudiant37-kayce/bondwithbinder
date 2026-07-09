'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Modal, Badge } from '@/components/ui';
import { SwipeCard, FitScoreBreakdown } from '@/components/features';
import { useUserStore } from '@/lib/stores/userStore';
import { FitScoreResult } from '@/types';
import { MapPin, Star, Clock, DollarSign, AlertCircle } from 'lucide-react';

interface DiscoverItem {
  id: string;
  type: 'request' | 'provider';
  data: any;
  fitScore: number;
  breakdown: FitScoreResult['breakdown'];
}

export default function DiscoverPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { activeRole } = useUserStore();
  const [items, setItems] = useState<DiscoverItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DiscoverItem | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setCurrentIndex(0);
    try {
      // Use the new discover API that excludes already swiped items
      const response = await fetch(`/api/discover?role=${activeRole}`);
      let itemsWithScores: DiscoverItem[] = [];

      if (activeRole === 'provider') {
        const requests = await response.json();

        itemsWithScores = await Promise.all(
          requests.map(async (req: any) => {
            try {
              const fitResponse = await fetch('/api/fitscore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetRequestId: req.id }),
              });
              const fitData = await fitResponse.json();
              return {
                id: req.id,
                type: 'request' as const,
                data: req,
                fitScore: fitData.score || 50,
                breakdown: fitData.breakdown || {},
              };
            } catch {
              return {
                id: req.id,
                type: 'request' as const,
                data: req,
                fitScore: 50,
                breakdown: {},
              };
            }
          })
        );
      } else {
        const data = await response.json();

        if (data.providers) {
          itemsWithScores = await Promise.all(
            data.providers.map(async (provider: any) => {
              try {
                const fitResponse = await fetch('/api/fitscore', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ targetUserId: provider.id }),
                });
                const fitData = await fitResponse.json();
                return {
                  id: provider.id,
                  type: 'provider' as const,
                  data: provider,
                  fitScore: fitData.score || 50,
                  breakdown: fitData.breakdown || {},
                };
              } catch {
                return {
                  id: provider.id,
                  type: 'provider' as const,
                  data: provider,
                  fitScore: 50,
                  breakdown: {},
                };
              }
            })
          );
        }
      }

      setItems(itemsWithScores);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  }, [activeRole]);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchItems();
  }, [session, router, fetchItems]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const item = items[currentIndex];
    if (!item) return;

    try {
      await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: item.type === 'provider' ? item.id : null,
          targetRequestId: item.type === 'request' ? item.id : null,
          direction,
          swiperRole: activeRole,
          fitScore: item.fitScore,
        }),
      });

      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to record swipe:', error);
    }
  };

  const handleInfo = () => {
    const item = items[currentIndex];
    if (item) {
      setSelectedItem(item);
      setShowBreakdown(true);
    }
  };

  const currentItem = items[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="spinner" />
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No more {activeRole === 'client' ? 'providers' : 'requests'}
        </h2>
        <p className="text-gray-text mb-6">
          Check back later or adjust your preferences
        </p>
        <Button onClick={fetchItems}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Discover</h1>
        <p className="text-sm text-gray-text">
          {activeRole === 'client'
            ? 'Swipe right on providers you like'
            : 'Swipe right on requests you can help with'}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {items.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((item, idx) => (
          <div
            key={item.id}
            className={`w-2 h-2 rounded-full ${
              idx + Math.max(0, currentIndex - 2) < currentIndex
                ? 'bg-primary'
                : idx + Math.max(0, currentIndex - 2) === currentIndex
                  ? 'bg-primary-dark'
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Card Stack */}
      <div className="relative h-[450px] max-w-sm mx-auto">
        <AnimatePresence>
          {currentIndex < items.length && (
            <SwipeCard
              key={items[currentIndex].id}
              id={items[currentIndex].id}
              type={items[currentIndex].type}
              data={items[currentIndex].data}
              fitScore={items[currentIndex].fitScore}
              onSwipe={handleSwipe}
              onInfo={handleInfo}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Swipe count */}
      <div className="text-center mt-4 text-sm text-gray-text">
        {currentIndex} of {items.length} viewed
      </div>

      {/* FitScore Breakdown Modal */}
      <FitScoreBreakdown
        isOpen={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        score={selectedItem?.fitScore || 0}
        breakdown={selectedItem?.breakdown || ({} as any)}
      />
    </div>
  );
}
