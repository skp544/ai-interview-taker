import z from "zod";

export const createInterviewSchema = z.object({
  role: z.string().min(1),
  type: z.string().min(1),
  level: z.string().min(1),
  techStack: z.array(z.string()).min(1),
  amount: z.coerce.number().int().min(1).max(20),
});

export const updateInterviewSchema = createInterviewSchema.partial();

export type CreateInterviewBody = z.infer<typeof createInterviewSchema>;
