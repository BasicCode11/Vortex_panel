import apiRequest from "./axios";
import { rolesResponseSchema, type Role } from "../../schemas/userSchema";

export const roleService = {
  getRole: async (): Promise<Role[]> => {
    const response = await apiRequest.get('/api/roles');
    return rolesResponseSchema.parse(response.data);
  },
};