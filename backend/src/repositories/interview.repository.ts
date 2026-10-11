import { InterviewModel } from "../models/interview.model";
import type { InterviewDocument } from "../models/interview.model";

export type CreateInterviewData = Pick<
  InterviewDocument,
  | "role"
  | "type"
  | "level"
  | "techStack"
  | "questions"
  | "finalized"
  | "coverImage"
>;

export const interviewRepository = {
  create: (data: CreateInterviewData) => InterviewModel.create(data),

  list: ({ page, limit }: { page: number; limit: number }) =>
    InterviewModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),

  getById: (id: string) => InterviewModel.findById(id),
};
