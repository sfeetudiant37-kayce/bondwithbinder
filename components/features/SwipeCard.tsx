'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Star, Clock, DollarSign, Info, X, Heart, Check } from 'lucide-react';
import { Avatar, Badge, Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils/formatters';
import { FitScoreBadge } from './FitScoreBadge';

interface SwipeCardProps {
  id: string;
  type: 'request' | 'provider';
  data: any;
  fitScore: number;
  onSwipe: (direction: 'left' | 'right') => void;
  onInfo?: () => void;
}

export function SwipeCard({
  id,
  type,
  data,
  fitScore,
  onSwipe,
  onInfo,
}: SwipeCardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [0, 100, 300], [0, 1, 1]);
  const nopeOpacity = useTransform(x, [-300, -100, 0], [1, 1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitDirection('right');
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitDirection('left');
      onSwipe('left');
    }
  };

  if (exitDirection === 'left') {
    return (
      <motion.div
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: -400, opacity: 0, rotate: -30 }}
        transition={{ duration: 0.3 }}
        className="absolute w-full h-full"
      />
    );
  }

  if (exitDirection === 'right') {
    return (
      <motion.div
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: 400, opacity: 0, rotate: 30 }}
        transition={{ duration: 0.3 }}
        className="absolute w-full h-full"
      />
    );
  }

  if (type === 'request') {
    return (
      <motion.div
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragEnd={handleDragEnd}
        className="absolute w-full h-full select-none"
      >
        <div className="relative w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-border">
          {/* Like/Nope overlays */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 right-6 z-20 rotate-[25deg]"
          >
            <div className="px-4 py-2 border-4 border-green-500 text-green-500 font-bold text-xl rounded-lg bg-white/90">
              INTERESTED
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 left-6 z-20 rotate-[-25deg]"
          >
            <div className="px-4 py-2 border-4 border-destructive text-destructive font-bold text-xl rounded-lg bg-white/90">
              PASS
            </div>
          </motion.div>

          {/* Card content */}
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={data.client?.profile?.photoUrl}
                  name={data.client?.name || 'Client'}
                  size="lg"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {data.title}
                  </h3>
                  <p className="text-sm text-gray-text">
                    by {data.client?.name}
                  </p>
                </div>
              </div>
              <FitScoreBadge score={fitScore} />
            </div>

            <p className="text-gray-700 text-sm mb-4 flex-1 overflow-auto">
              {data.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-text" />
                <span>{data.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-gray-text" />
                <span>{formatPrice(data.budget)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-text" />
                <Badge variant={data.urgency === 'urgent' ? 'destructive' : 'gray'}>
                  {data.urgency.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {JSON.parse(data.skills || '[]').map((skill: string) => (
                  <Badge key={skill} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-border">
              <button
                onClick={() => {
                  setExitDirection('left');
                  onSwipe('left');
                }}
                className="p-3 rounded-full bg-gray-100 hover:bg-destructive-light text-gray-600 hover:text-destructive transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={onInfo}
                className="p-3 rounded-full bg-gray-100 hover:bg-primary-light text-gray-600 hover:text-primary transition-colors"
              >
                <Info className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  setExitDirection('right');
                  onSwipe('right');
                }}
                className="p-3 rounded-full bg-primary-light hover:bg-primary text-primary hover:text-white transition-colors"
              >
                <Check className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Provider card
  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      className="absolute w-full h-full select-none"
    >
      <div className="relative w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-border">
        {/* Like/Nope overlays */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 right-6 z-20 rotate-[25deg]"
        >
          <div className="px-4 py-2 border-4 border-green-500 text-green-500 font-bold text-xl rounded-lg bg-white/90">
            INTERESTED
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-6 left-6 z-20 rotate-[-25deg]"
        >
          <div className="px-4 py-2 border-4 border-destructive text-destructive font-bold text-xl rounded-lg bg-white/90">
            PASS
          </div>
        </motion.div>

        {/* Card content */}
        <div className="p-5 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={data.profile?.photoUrl}
                name={data.name || 'Provider'}
                size="lg"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {data.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">
                    {data.profile?.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-xs text-gray-text">
                    ({data.profile?.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
            <FitScoreBadge score={fitScore} />
          </div>

          <p className="text-gray-700 text-sm mb-4 flex-1 overflow-auto">
            {data.profile?.bio || 'No bio available'}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-text" />
              <span>{data.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-gray-text" />
              <span>{formatPrice(data.profile?.price || 0)}/service</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-text" />
              <Badge variant={data.profile?.availability === 'immediate' ? 'success' : 'gray'}>
                {data.profile?.availability?.replace('_', ' ') || 'flexible'}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {JSON.parse(data.profile?.skills || '[]').map((skill: string) => (
                <Badge key={skill} variant="primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-border">
            <button
              onClick={() => {
                setExitDirection('left');
                onSwipe('left');
              }}
              className="p-3 rounded-full bg-gray-100 hover:bg-destructive-light text-gray-600 hover:text-destructive transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={onInfo}
              className="p-3 rounded-full bg-gray-100 hover:bg-primary-light text-gray-600 hover:text-primary transition-colors"
            >
              <Info className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setExitDirection('right');
                onSwipe('right');
              }}
              className="p-3 rounded-full bg-primary-light hover:bg-primary text-primary hover:text-white transition-colors"
            >
              <Check className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
