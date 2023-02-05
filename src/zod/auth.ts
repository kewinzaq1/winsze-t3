import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
