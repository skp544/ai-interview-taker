import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// Route params: /:id
export const idParamSchema = z.object({ id: objectIdSchema });

// Query string: ?page=1&limit=10
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type IdParam = z.infer<typeof idParamSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// Route params: /:interviewId
export const interviewIdParamSchema = z.object({ interviewId: objectIdSchema });
export type InterviewIdParam = z.infer<typeof interviewIdParamSchema>;
