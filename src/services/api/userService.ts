import apiRequest from "./axios";
import { 
  userResponseSchema, 
  usersResponseSchema,
  UserResponse,
  CreateUserFormData,
  UpdateUserFormData,
  UpdatePasswordFormData,
  meResponseSchema,
  MeResponse
} from "../../schemas/userSchema";
import { fetchList } from "./fetchList";

export const userService = {
  getprofile: async(): Promise<MeResponse> => {
    const resonse = await apiRequest.get(`/api/me/profile`);
    return meResponseSchema.parse(resonse.data);
  },
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
    const formData = new FormData();
    
    // Log what we're sending for debugging
    console.log('Data received in userService:', data);
    
    // CRITICAL: Only append fields that actually exist in data object and have values
    // DO NOT append email, role_id, or email_verified unless explicitly provided
    
    if (data.first_name && data.first_name.trim() !== '') {
      formData.append("first_name", data.first_name);
    }
    
    if (data.last_name && data.last_name.trim() !== '') {
      formData.append("last_name", data.last_name);
    }
    
    if (data.phone && data.phone.trim() !== '') {
      formData.append("phone", data.phone);
    }
    
    if (data.picture instanceof File) {
      formData.append("picture", data.picture);
    }
    
    // Address fields - only if provided
    if (data.address_type && data.address_type.trim() !== '') {
      formData.append("address_type", data.address_type);
    }
    
    if (data.label && data.label.trim() !== '') {
      formData.append("label", data.label);
    }
    
    if (data.recipient_name && data.recipient_name.trim() !== '') {
      formData.append("recipient_name", data.recipient_name);
    }
    
    if (data.company && data.company.trim() !== '') {
      formData.append("company", data.company);
    }
    
    if (data.street_address && data.street_address.trim() !== '') {
      formData.append("street_address", data.street_address);
    }
    
    if (data.apartment_suite && data.apartment_suite.trim() !== '') {
      formData.append("apartment_suite", data.apartment_suite);
    }
    
    if (data.city && data.city.trim() !== '') {
      formData.append("city", data.city);
    }
    
    if (data.state && data.state.trim() !== '') {
      formData.append("state", data.state);
    }
    
    if (data.country && data.country.trim() !== '') {
      formData.append("country", data.country);
    }
    
    if (data.postal_code && data.postal_code.trim() !== '') {
      formData.append("postal_code", data.postal_code);
    }
    
    if (data.longitude !== undefined && data.longitude !== null && !isNaN(data.longitude)) {
      formData.append("longitude", data.longitude.toString());
    }
    
    if (data.latitude !== undefined && data.latitude !== null && !isNaN(data.latitude)) {
      formData.append("latitude", data.latitude.toString());
    }
    
    // Log FormData contents for debugging
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    const response = await apiRequest.put(`/api/user/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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