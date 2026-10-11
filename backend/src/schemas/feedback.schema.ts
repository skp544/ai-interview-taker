import { z } from "zod";
import { feedbackCategoryNames } from "../constants";
import { objectIdSchema } from "./common.schema";

export const transcriptEntrySchema = z.object({
  role: z.string(),
  content: z.string(),
});

export const createFeedbackSchema = z.object({
  interviewId: objectIdSchema,
  transcript: z.array(transcriptEntrySchema).min(1),
  feedbackId: objectIdSchema.optional(),
});

export const feedbackSchema = z.object({
  totalScore: z.number().min(0).max(100),
  categoryScores: z
    .array(
      z.object({
        name: z.enum(feedbackCategoryNames),
        score: z.number().min(0).max(100),
        comment: z.string(),
      }),
    )
    .length(5),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export type FeedbackAI = z.infer<typeof feedbackSchema>;

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
