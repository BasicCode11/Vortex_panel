import { z } from 'zod';
import { userResponseSchema } from './userSchema';
import { addressSchema } from './addressSchema';
// Login form validation
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').trim(),
  password: z.string().min(1, 'Password is required'),
});


// Login user schema (simplified user object in login response)
export const loginUserSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role_id: z.number(),
  email_verified: z.boolean(),
});

export const LoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  user: loginUserSchema,
});

// Current user response validation (/me endpoint)
export const meResponseSchema = z.object({
  user: userResponseSchema,
  addresses: z.array(addressSchema),
});

// Forgot password schemas
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

export const verifyResetCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().min(1, 'Verification code is required'),
});

export const resetPasswordSchema = z.object({
  reset_token: z.string().min(1, 'Reset token is required'),
  new_password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
});

// Forgot password response schemas
export const forgotPasswordResponseSchema = z.object({
  message: z.string(),
});

export const verifyResetCodeResponseSchema = z.object({
  reset_token: z.string(),
  message: z.string().optional(),
});

export const resetPasswordResponseSchema = z.object({
  message: z.string(),
});

// TypeScript types
export type LoginRequest = z.infer<typeof loginSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetCodeRequest = z.infer<typeof verifyResetCodeSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>;
export type VerifyResetCodeResponse = z.infer<typeof verifyResetCodeResponseSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
