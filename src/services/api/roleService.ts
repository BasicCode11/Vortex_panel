import { CreateRole, Permission, permissionRespon, rolesListSchema, RoleWithPermissions, roleWithPermissionsSchema, UpdateRole } from "../../schemas/roleSchema";
import { rolesResponseSchema, type Role } from "../../schemas/userSchema";
import apiRequest from "./axios";
import { fetchList } from "./fetchList";

export const roleService = {
  getRole: async (): Promise<Role[]> => {
    return fetchList<Role[]>('/api/roles', rolesResponseSchema);
  },
  
  getRolePermission : async() : Promise<RoleWithPermissions[]> => {
    return fetchList<RoleWithPermissions[]>('/api/roles',rolesListSchema);
  },

  getPermission : async() : Promise<Permission[]> => {
    return fetchList<Permission[]>('/api/permissions',permissionRespon);
  },

  getRoleById : async(id:number | undefined) : Promise<RoleWithPermissions> => {
    const response = await apiRequest.get(`/api/roles/${id}`);
    return roleWithPermissionsSchema.parse(response.data);
  },
  
  createRole : async(data : CreateRole) : Promise<RoleWithPermissions> =>{
    const response = await apiRequest.post('/api/roles', data);
    return roleWithPermissionsSchema.parse(response.data);

  },
  updateRole : async(id:number,data : UpdateRole) : Promise<RoleWithPermissions> =>{
    const response = await apiRequest.put(`/api/roles/${id}`, data);
    return roleWithPermissionsSchema.parse(response.data);

  },
  deleteRole: async (id: number): Promise<void> => {
    await apiRequest.delete(`/api/roles/${id}`);
  },
};