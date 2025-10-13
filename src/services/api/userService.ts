import apiRequest from "./axios";
import { 
  userResponseSchema, 
  usersResponseSchema,
  UserResponse,
  CreateUserFormData,
  UpdateUserFormData,
  UpdatePasswordFormData
} from "../../schemas/userSchema";
import { fetchList } from "./fetchList";

export const userService = {
  // Get all users
  getUser: async (): Promise<UserResponse[]> => {
    return fetchList<UserResponse[]>('/api/users', usersResponseSchema);
  },

  // Get single user by ID
  getUserById: async (id: number): Promise<UserResponse> => {
    const response = await apiRequest.get(`/api/users/${id}`);
    return userResponseSchema.parse(response.data);
  },

  // Create user
  createUser: async (data: CreateUserFormData): Promise<UserResponse> => {
    const response = await apiRequest.post('/api/users', data);
    return userResponseSchema.parse(response.data);
  },

  // Update user
  updateUser: async (id: number, data: UpdateUserFormData): Promise<UserResponse> => {
    const response = await apiRequest.put(`/api/users/${id}`, data);
    return userResponseSchema.parse(response.data);
  },

  // Update user password (super admin only)
  updateUserPassword: async (id: number, data: UpdatePasswordFormData): Promise<void> => {
    await apiRequest.put(`/api/users/${id}/password`, data);
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiRequest.delete(`/api/users/${id}`);
  },
};