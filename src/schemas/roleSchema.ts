
import { z } from 'zod';

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const roleWithPermissionsSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(), 
  permissions: z.array(permissionSchema), 

});

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(3, 'Role must be at least 3 characters')
    .max(15, 'Role must not exceed 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Role can only contain letters, numbers, and underscores'),
  description: z.string().nullable().optional(), 
  permission_ids: z
    .array(
      z.number().int().min(1, 'Permission ID must be a positive integer')
    )
    .min(1, 'At least one permission is required')
});

export const updateRoleSchema = z.object({
  // 1. Required: The ID of the role being updated
  id: z.number().int().positive('Role ID must be a positive integer'),
  name: z.string().optional(),
  description:z.string().nullable().optional(), 
  permission_ids: z
    .array(
      z.number().int().min(1, 'Permission ID must be a positive integer')
    ).optional()
});



export const rolesListSchema = z.array(roleWithPermissionsSchema);
export const permissionRespon = z.array(permissionSchema);

export type UpdateRole = z.infer<typeof updateRoleSchema>;
export type Permission = z.infer<typeof permissionSchema>;
export type RoleWithPermissions = z.infer<typeof roleWithPermissionsSchema>;
export type CreateRole = z.infer<typeof createRoleSchema>;