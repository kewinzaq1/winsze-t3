import { z } from "zod";

export const addPostSchema = z.object({
  content: z.string(),
  image: z.string().url().optional(),
  id: z.string().uuid(),
});
