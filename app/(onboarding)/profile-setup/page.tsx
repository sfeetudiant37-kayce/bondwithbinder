'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, Button, Input } from '@/components/ui';
import { Camera, MapPin } from 'lucide-react';

const locations = ['Douala', 'Yaoundé', 'Buea', 'Bamenda', 'Bafoussam', 'Garoua'];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    phone: '',
    location: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleContinue = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      // Update user
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          profileCompletion: 60,
        }),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Complete your profile
        </h2>
        <p className="text-gray-text text-sm">
          Add some details to help others find you
        </p>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {formData.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U'}
            </span>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-border">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <form className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+237 6XX XXX XXX"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-text" />
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-border rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-light focus:border-primary"
              required
            >
              <option value="">Select your city</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Bio (optional)
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            placeholder="Tell others about yourself..."
            className="w-full px-4 py-3 bg-white border border-gray-border rounded-lg text-gray-900 placeholder:text-gray-text focus:ring-2 focus:ring-primary-light focus:border-primary"
          />
        </div>
      </form>

      <Button
        onClick={handleContinue}
        disabled={!formData.name || !formData.location}
        className="w-full mt-6"
        loading={loading}
      >
        Complete Setup
      </Button>

      <Button variant="ghost" onClick={() => router.push('/dashboard')} className="w-full mt-3">
        Do this later
      </Button>
    </Card>
  );
}
