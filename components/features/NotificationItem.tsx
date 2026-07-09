'use client';

import React from 'react';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { Bell, MessageSquare, Star, UserCheck } from 'lucide-react';

interface NotificationItemProps {
  notification: any;
  onMarkRead: () => void;
  onClick?: () => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onClick,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'new_match':
        return <UserCheck className="w-5 h-5 text-primary" />;
      case 'provider_interest':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-text" />;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 transition-colors ${
        notification.isRead ? 'bg-white' : 'bg-primary-light/30'
      } ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">
          {notification.title}
        </p>
        <p className="text-gray-text text-sm mt-0.5">{notification.body}</p>
        <p className="text-xs text-gray-text mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead();
          }}
          className="flex-shrink-0 p-1 text-xs text-primary hover:bg-primary-light rounded"
        >
          Mark read
        </button>
      )}
    </div>
  );
}
