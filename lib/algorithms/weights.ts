import { WeightConfig } from '@/types';

export function adjustWeights(
  currentWeights: WeightConfig,
  swipeDirection: 'left' | 'right',
  matchingFactors: {
    locationMatch: boolean;
    highRating: boolean;
    priceMatch: boolean;
    skillMatch: boolean;
  }
): WeightConfig {
  const delta = swipeDirection === 'right' ? 0.02 : -0.01;
  const newWeights = { ...currentWeights };

  if (matchingFactors.locationMatch) {
    newWeights.location = Math.max(0.05, Math.min(0.35, newWeights.location + delta));
  }
  if (matchingFactors.highRating) {
    newWeights.rating = Math.max(0.05, Math.min(0.3, newWeights.rating + delta));
  }
  if (matchingFactors.priceMatch) {
    newWeights.price = Math.max(0.05, Math.min(0.3, newWeights.price + delta));
  }
  if (matchingFactors.skillMatch) {
    newWeights.preferences = Math.max(0.05, Math.min(0.35, newWeights.preferences + delta));
  }

  // Normalize to sum = 1.0
  const total =
    newWeights.preferences +
    newWeights.location +
    newWeights.price +
    newWeights.rating +
    newWeights.availability +
    newWeights.profileCompleteness +
    newWeights.experience;

  return {
    ...newWeights,
    preferences: newWeights.preferences / total,
    location: newWeights.location / total,
    price: newWeights.price / total,
    rating: newWeights.rating / total,
    availability: newWeights.availability / total,
    profileCompleteness: newWeights.profileCompleteness / total,
    experience: newWeights.experience / total,
  };
}
