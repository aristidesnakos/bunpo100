import { z } from 'zod';

// Define the profile schema
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().nullable(),
  price_id: z.string().nullable(),
  email: z.string().email().nullable(),
  name: z.string().nullable(),
  updated_at: z.string().datetime().nullable(),
  has_access: z.boolean().nullable(),
});

// Export the type for TypeScript usage
export type Profile = z.infer<typeof ProfileSchema>;
