import { z } from 'zod';

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Team schema (nullable when embedded on User)
const teamSchema = z.object({
  id: z.number(),
  team_name: z.string(),
}).nullable();

// Agent schema (nullable when embedded on User)
const agentSchema = z.object({
  id: z.number(),
  agent_name: z.string(),
}).nullable();

// Non-null entity schemas for list endpoints
export const teamEntitySchema = z.object({
  id: z.number(),
  team_name: z.string(),
});

export const agentEntitySchema = z.object({
  id: z.number(),
  agent_name: z.string(),
});

// User response schema
export const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: roleSchema,
  team: teamSchema,
  agents: agentSchema,
  last_active: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  status: z.boolean(),
  permissions: z.array(z.string()).optional(),
});

// Array of users response
export const usersResponseSchema = z.array(userResponseSchema);

// List endpoints
export const rolesResponseSchema = z.array(roleSchema);
export const teamsResponseSchema = z.array(teamEntitySchema);
export const agentsResponseSchema = z.array(agentEntitySchema);


export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  
  role: z
    .string()
    .min(1, 'Role is required'),
  
  team: z
    .string()
    .optional(),
  
  agent: z
    .string()
    .optional(),
  
  status: z
    .enum(['active', 'inactive'], {
      message: 'Status must be either active or inactive', 
    })
    .default('active'),
});

// User update schema (password is optional)
export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number')
    .optional()
    .or(z.literal('')), // Allow empty string (means don't change password)
  
  role: z
    .string()
    .min(1, 'Role is required'),
  
  team: z
    .string()
    .optional(),
  
  agent: z
    .string()
    .optional(),
  
  status: z
    .enum(['active', 'inactive'], {
       message: 'Status must be either active or inactive', 
    }),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Team = z.infer<typeof teamEntitySchema>;
export type Agent = z.infer<typeof agentEntitySchema>;
