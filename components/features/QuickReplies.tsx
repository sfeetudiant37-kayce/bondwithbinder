'use client';

import React from 'react';

const defaultReplies = [
  'Yes, I am available.',
  'Can you share more details?',
  'Let me check and get back to you.',
  'Thank you for reaching out!',
];

interface QuickRepliesProps {
  onSelect: (reply: string) => void;
  customReplies?: string[];
}

export function QuickReplies({ onSelect, customReplies }: QuickRepliesProps) {
  const replies = customReplies || defaultReplies;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className="px-3 py-1.5 bg-primary-light text-primary text-sm rounded-full whitespace-nowrap hover:bg-primary hover:text-white transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
