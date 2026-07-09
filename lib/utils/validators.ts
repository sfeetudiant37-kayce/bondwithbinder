import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for API - doesn't require confirmPassword
export const signupApiSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for client-side form - includes confirmPassword validation
export const signupFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  availability: z.enum(['immediate', 'this_week', 'flexible']),
  skills: z.array(z.string()).max(10, 'Maximum 10 skills'),
});

export const requestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  budget: z.number().min(1, 'Budget must be positive'),
  urgency: z.enum(['urgent', 'this_week', 'flexible']),
  skills: z.array(z.string()).min(1, 'At least one skill required'),
});

export const messageSchema = z.object({
  conversationId: z.string().optional(),
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
});

export const reviewSchema = z.object({
  matchId: z.string(),
  revieweeId: z.string(),
  rating: z.number().min(1, 'Rating required').max(5, 'Maximum 5 stars'),
  comment: z.string().max(500, 'Comment too long').optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupApiSchema>;
export type SignupFormInput = z.infer<typeof signupFormSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type RequestInput = z.infer<typeof requestSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
