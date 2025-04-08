import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

export const rsvpSchema = z.object({
  name: z.string(),
  attending: z.boolean(),
  guests: z.number().int().min(0),
});

export const formSchemas: Record<string, z.ZodObject<any>> = {
  feedback: feedbackSchema,
  rsvp: rsvpSchema,
};
