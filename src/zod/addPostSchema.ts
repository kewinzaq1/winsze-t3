import { z } from "zod";

export const addPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string().url().optional(),
});
