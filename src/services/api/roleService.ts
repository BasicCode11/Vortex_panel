import { rolesListSchema, RoleWithPermissions } from "../../schemas/roleSchema";
import { rolesResponseSchema, type Role } from "../../schemas/userSchema";
import { fetchList } from "./fetchList";

export const roleService = {
  getRole: async (): Promise<Role[]> => {
    return fetchList<Role[]>('/api/roles', rolesResponseSchema);
  },
  
  getRolePermission : async() : Promise<RoleWithPermissions[]> => {
    return fetchList<RoleWithPermissions[]>('/api/roles',rolesListSchema);
  }
};