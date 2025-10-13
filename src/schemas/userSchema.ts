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
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must not exceed 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .nullable()
    .optional(),

  role_id: z
    .number({ message: 'Role is required' })
    .int('Role must be a valid number')
    .min(1, 'Role is required')
    .nullable()
    .optional(),

  team_id: z
    .union([
      z.number().int().min(1, 'Team is invalid'),
      z.null(),
    ])
    .optional(),

  agent_id: z
    .union([
      z.number().int().min(1, 'Agent is invalid'),
      z.null(),
    ])
    .optional(),

  status: z
    .boolean()
    .nullable()
    .optional(),
});

// Password update schema (separate endpoint for super admin)
export const updatePasswordSchema = z.object({
  new_password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Team = z.infer<typeof teamEntitySchema>;
export type Agent = z.infer<typeof agentEntitySchema>;

