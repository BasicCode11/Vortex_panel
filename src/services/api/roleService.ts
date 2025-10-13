import { rolesResponseSchema, type Role } from "../../schemas/userSchema";
import { fetchList } from "./fetchList";

export const roleService = {
  getRole: async (): Promise<Role[]> => {
    return fetchList<Role[]>('/api/roles', rolesResponseSchema);
  },
};