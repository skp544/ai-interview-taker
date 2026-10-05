import { z } from "zod";

export const transcriptEntrySchema = z.object({
  role: z.string(),
  content: z.string(),
});

export const createFeedbackSchema = z.object({
  interviewId: z.string(),
  transcript: z.array(transcriptEntrySchema).min(1),
  feedbackId: z.string().optional(),
});
