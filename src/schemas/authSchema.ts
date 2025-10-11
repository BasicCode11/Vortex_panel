import { z } from 'zod';
import { userResponseSchema } from './userSchema';

// Login form validation
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required'),
});

// Login API response validation
export const loginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  user: userResponseSchema.optional(),
});

// Current user response validation
export const meResponseSchema = userResponseSchema;

// TypeScript types
export type LoginFormData = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
