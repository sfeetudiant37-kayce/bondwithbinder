import { WeightConfig, FitScoreResult, FitScoreBreakdown } from '@/types';

export function calculateFitScore(
  userPreferences: string[],
  targetSkills: string[],
  userLocation: string,
  targetLocation: string,
  userPrice: number,
  targetPrice: number,
  targetRating: number,
  targetAvailability: string,
  targetProfileCompletion: number,
  targetExperience: number,
  weights: WeightConfig
): FitScoreResult {
  // 1. Preferences match (Jaccard similarity)
  const userSet = new Set(userPreferences.map((p) => p.toLowerCase()));
  const targetSet = new Set(targetSkills.map((s) => s.toLowerCase()));
  const intersection = [...userSet].filter((p) => targetSet.has(p));
  const union = new Set([...userSet, ...targetSet]);
  const preferencesScore = union.size > 0 ? intersection.length / union.size : 0.3;

  // 2. Location match
  const locationScore =
    userLocation.toLowerCase() === targetLocation.toLowerCase() ? 1.0 : 0.3;

  // 3. Price fit (smaller difference = higher score)
  const priceDiff = Math.abs(userPrice - targetPrice);
  const maxPrice = Math.max(userPrice, targetPrice, 1);
  const priceScore = 1 - priceDiff / maxPrice;

  // 4. Rating normalized to 0-1
  const ratingScore = targetRating / 5;

  // 5. Availability score
  const availabilityScore =
    targetAvailability === 'immediate'
      ? 1.0
      : targetAvailability === 'this_week'
        ? 0.7
        : targetAvailability === 'flexible'
          ? 0.5
          : 0.3;

  // 6. Profile completeness
  const completenessScore = targetProfileCompletion / 100;

  // 7. Experience (capped at 10 years for full score)
  const experienceScore = Math.min(targetExperience / 10, 1);

  // Weighted sum
  const raw =
    weights.preferences * preferencesScore +
    weights.location * locationScore +
    weights.price * priceScore +
    weights.rating * ratingScore +
    weights.availability * availabilityScore +
    weights.profileCompleteness * completenessScore +
    weights.experience * experienceScore;

  const score = Math.round(raw * 100);

  return {
    score,
    breakdown: {
      preferences: Math.round(preferencesScore * 100),
      location: Math.round(locationScore * 100),
      price: Math.round(priceScore * 100),
      rating: Math.round(ratingScore * 100),
      availability: Math.round(availabilityScore * 100),
      profileCompleteness: Math.round(completenessScore * 100),
      experience: Math.round(experienceScore * 100),
    },
  };
}

export function getDefaultWeights(): WeightConfig {
  return {
    id: '',
    userId: '',
    preferences: 0.2,
    location: 0.15,
    price: 0.15,
    rating: 0.15,
    availability: 0.1,
    profileCompleteness: 0.1,
    experience: 0.15,
    updatedAt: new Date(),
  };
}
