'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({
  message,
  type = 'success',
  isVisible,
  onClose,
}: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-destructive" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-destructive-light border-destructive',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 ${backgrounds[type]} border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 max-w-sm`}
        >
          {icons[type]}
          <p className="text-sm text-gray-800 flex-1">{message}</p>
          <button onClick={onClose} className="p-1 hover:opacity-70">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
