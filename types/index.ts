import { User as PrismaUser } from '@prisma/client';

export interface User extends PrismaUser {
  profile?: Profile | null;
  weights?: WeightConfig | null;
}

export interface Profile {
  id: string;
  userId: string;
  photoUrl: string | null;
  bio: string | null;
  price: number | null;
  availability: string;
  experience: number;
  rating: number;
  reviewCount: number;
  skills: string;
  preferences: string;
  objective: string;
  socialLinks?: string | null;
}

export interface WeightConfig {
  id: string;
  userId: string;
  preferences: number;
  location: number;
  price: number;
  rating: number;
  availability: number;
  profileCompleteness: number;
  experience: number;
  updatedAt?: Date;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  urgency: string;
  skills: string;
  status: string;
  createdAt: Date;
}

export interface Swipe {
  id: string;
  swiperId: string;
  targetUserId: string | null;
  targetRequestId: string | null;
  swiperRole: string;
  direction: string;
  fitScore: number;
  createdAt: Date;
}

export interface Match {
  id: string;
  clientId: string;
  providerId: string;
  requestId: string | null;
  initiatedBy: string;
  clientFitScore: number;
  providerFitScore: number | null;
  status: string;
  contactRevealed: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  matchId: string;
  createdAt: Date;
  lastMessageAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  sentAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  referenceId: string | null;
  createdAt: Date;
}

export interface FitScoreBreakdown {
  preferences: number;
  location: number;
  price: number;
  rating: number;
  availability: number;
  profileCompleteness: number;
  experience: number;
}

export interface FitScoreResult {
  score: number;
  breakdown: FitScoreBreakdown;
}

export interface UserWithProfile extends User {
  profile: Profile | null;
}

export interface MatchWithDetails extends Match {
  client: UserWithProfile;
  provider: UserWithProfile;
  request?: ServiceRequest | null;
  conversation?: Conversation | null;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
