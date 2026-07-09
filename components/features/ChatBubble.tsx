'use client';

import React from 'react';
import { Message } from '@/types';
import { formatRelativeTime } from '@/lib/utils/formatters';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isOwn
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-white border border-gray-border text-gray-900 rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? 'text-primary-light' : 'text-gray-text'
          }`}
        >
          {formatRelativeTime(message.sentAt)}
        </p>
      </div>
    </div>
  );
}
