import { z } from 'zod';
import { userResponseSchema } from './userSchema';

// Login form validation
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').trim(),
  password: z.string().min(1, 'Password is required'),
});


export const LoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().optional(),
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
});

// Current user response validation
export const meResponseSchema = userResponseSchema.extend({
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  email_verified: z.boolean().optional(),
});

// TypeScript types
export type LoginRequest = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
