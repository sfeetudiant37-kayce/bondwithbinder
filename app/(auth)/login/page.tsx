'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        Sign In
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-destructive-light rounded-lg flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-text">
          Do not have an account?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-border">
        <p className="text-xs text-gray-text text-center mb-3">Test accounts:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setEmail('marie@binder.cm');
              setPassword('password123');
            }}
            className="text-primary hover:underline"
          >
            Marie (Client)
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('paul@binder.cm');
              setPassword('password123');
            }}
            className="text-primary hover:underline"
          >
            Paul (Provider)
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('jp@binder.cm');
              setPassword('password123');
            }}
            className="text-primary hover:underline"
          >
            JP (Dual-role)
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('sarah@binder.cm');
              setPassword('password123');
            }}
            className="text-primary hover:underline"
          >
            Sarah (New)
          </button>
        </div>
      </div>
    </Card>
  );
}
