import { Role } from "../types/user";
import apiRequest from "./axios";

export const roleService = {
    getRole : async() : Promise<Role[]> => {
        const response = await apiRequest.get<Role[]>('/api/roles');
        return response.data;
    }
}