'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input } from '@/components/ui';
import { Chip } from '@/components/ui';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const categories = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Moving',
  'Catering',
  'Other',
];

const skills = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Welding',
  'Tiling',
  'Cleaning',
  'Moving',
  'Tailoring',
  'Catering',
  'Photography',
  'Web Design',
];

const locations = ['Douala', 'Yaoundé', 'Buea', 'Bamenda', 'Bafoussam', 'Garoua'];

export default function NewRequestPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    urgency: 'flexible',
    skills: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          budget: parseFloat(formData.budget) || 0,
          urgency: formData.urgency,
          skills: formData.skills,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create request');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/requests');
      }, 1500);
    } catch (err) {
      setError('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Request Posted
        </h2>
        <p className="text-gray-text text-center">
          Your request has been posted. Providers will be able to see it soon.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">New Request</h1>
        <p className="text-sm text-gray-text mt-1">
          Post a service request for providers to find
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive-light rounded-lg flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Fix broken bathroom sink"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe what you need in detail..."
            className="w-full px-4 py-3 bg-white border border-gray-border rounded-lg text-gray-900 placeholder:text-gray-text focus:ring-2 focus:ring-primary-light focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-border rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-light focus:border-primary"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Location
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-border rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-light focus:border-primary"
            required
          >
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Budget (FCFA)"
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          placeholder="e.g., 15000"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Urgency
          </label>
          <div className="flex gap-3">
            {['urgent', 'this_week', 'flexible'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, urgency: level }))
                }
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.urgency === level
                    ? 'border-primary bg-primary-light text-primary-dark'
                    : 'border-gray-border text-gray-700 hover:bg-gray-50'
                }`}
              >
                {level.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Required Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Chip
                key={skill}
                selected={formData.skills.includes(skill)}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </Chip>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" loading={loading}>
          Post Request
        </Button>
      </form>
    </div>
  );
}
