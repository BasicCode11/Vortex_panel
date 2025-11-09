import { email, z } from 'zod';
import { roleSchema } from './roleSchema';
import { addressSchema } from './addressSchema';

// User response schema
export const userResponseSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role: roleSchema,
  phone: z.string(),
  picture: z.string().nullable(),
  email_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// /me endpoint response schema
export const meResponseSchema = z.object({
  user: userResponseSchema,
  addresses: z.array(addressSchema),
});

// Array of users response
export const usersResponseSchema = z.array(userResponseSchema);
// List endpoints
export const rolesResponseSchema = z.array(roleSchema);



export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must not exceed 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),


  role_id: z
    .number({ message: 'Role is required' })
    .int('Role is required')
    .min(1, 'Role is required'),

  team_id: z
    .union([
      z.number({ message: 'Team is invalid' }).int('Team is invalid').min(1, 'Team is invalid'),
      z.null(),
    ])
    .optional(),

  agent_id: z
    .union([
      z.number().int().min(1, 'Agent is invalid'),
      z.null(),
    ])
    .optional(),

  status: z.union([z.boolean(), z.null()]).optional(),
});

// User update schema (password handled via separate endpoint)
export const updateUserSchema = z.object({
  email: z.string().regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ).optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role_id: z.number().int().positive().optional(),
  phone: z.string().optional(),
  email_verified: z.boolean().optional(),
  picture: z.instanceof(File).optional(),
  address_type: z.enum(["home", "work", "billing", "shipping", "other"]).optional(),
  label: z.string().optional(),
  recipient_name: z.string().optional(),
  company: z.string().optional(),
  street_address: z.string().optional(),
  apartment_suite: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
});

// Password update schema (separate endpoint for super admin)
export const updatePasswordSchema = z.object({
  new_password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
});


export type UserResponse = z.infer<typeof userResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Address = z.infer<typeof addressSchema>;
