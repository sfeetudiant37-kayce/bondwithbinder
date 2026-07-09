import React from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  children: React.ReactNode;
  onRemove?: () => void;
  selected?: boolean;
  onClick?: () => void;
}

export function Chip({
  children,
  onRemove,
  selected = false,
  onClick,
}: ChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        selected
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
