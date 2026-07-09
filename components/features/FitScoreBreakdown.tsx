'use client';

import React from 'react';
import { Modal } from '@/components/ui';
import { FitScoreBreakdown as FitScoreBreakdownType } from '@/types';

interface FitScoreBreakdownProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  breakdown: FitScoreBreakdownType;
}

const factorLabels: Record<keyof FitScoreBreakdownType, string> = {
  preferences: 'Skill Match',
  location: 'Location',
  price: 'Price Fit',
  rating: 'Rating',
  availability: 'Availability',
  profileCompleteness: 'Profile Quality',
  experience: 'Experience',
};

export function FitScoreBreakdown({
  isOpen,
  onClose,
  score,
  breakdown,
}: FitScoreBreakdownProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FitScore Breakdown" size="md">
      <div className="space-y-4">
        <div className="text-center pb-4 border-b border-gray-border">
          <div className="text-5xl font-bold text-primary mb-1">{score}%</div>
          <p className="text-sm text-gray-text">Overall Fit Score</p>
        </div>

        <div className="space-y-3">
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {factorLabels[key as keyof FitScoreBreakdownType]}
                </span>
                <span className="font-medium text-gray-900">{value}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-text mt-4 pt-4 border-t border-gray-border">
          FitScore is calculated using a weighted average of all factors based on
          your preferences and interactions.
        </p>
      </div>
    </Modal>
  );
}
