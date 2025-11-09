import {z} from 'zod'

export const addressSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  address_type: z.string(),
  label: z.string(),
  recipient_name: z.string(),
  company: z.string(),
  street_address: z.string(),
  apartment_suite: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postal_code: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  is_default: z.boolean(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Address = z.infer<typeof addressSchema>;

