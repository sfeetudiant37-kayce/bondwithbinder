import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'destructive' | 'gray';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'primary', size = 'sm' }: BadgeProps) {
  const variants = {
    primary: 'bg-primary-light text-primary-dark',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-destructive-light text-destructive',
    gray: 'bg-gray-100 text-gray-text',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
