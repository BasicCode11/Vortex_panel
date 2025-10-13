import { type ZodSchema } from 'zod';
import apiRequest from './axios';

export const fetchList = async <T>(endpoint: string, schema: ZodSchema<T>) => {
  const response = await apiRequest.get(endpoint);
  return schema.parse(response.data);
};
