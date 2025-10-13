
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

export const rolesListSchema = z.array(roleWithPermissionsSchema);
export type RoleWithPermissions = z.infer<typeof roleWithPermissionsSchema>;