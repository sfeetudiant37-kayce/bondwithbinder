'use client';

import React from 'react';

interface FitScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function FitScoreBadge({ score, size = 'md' }: FitScoreBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500 text-white';
    if (score >= 60) return 'bg-primary text-white';
    if (score >= 40) return 'bg-yellow-500 text-white';
    return 'bg-gray-400 text-white';
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div
      className={`${getColor(score)} ${sizes[size]} rounded-full font-bold`}
    >
      {score}% Fit
    </div>
  );
}
