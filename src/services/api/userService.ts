import { UserResponse } from "../types/user"
import apiRequest from "./axios"

export const userService = {
    getUser: async (): Promise<UserResponse[]> => {
        const response = await apiRequest.get<UserResponse[]>('/api/users');
        return response.data;
    },
}