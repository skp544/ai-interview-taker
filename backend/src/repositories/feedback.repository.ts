import { FeedbackModel } from "../models/feedback.model";
import type { FeedbackAI } from "../schemas/feedback.schema";

export const feedbackRepository = {
  findByInterviewId: (interviewId: string) =>
    FeedbackModel.findOne({ interviewId }),

  // One feedback per interview: re-scoring replaces the previous result.
  upsertByInterviewId: (interviewId: string, data: FeedbackAI) =>
    FeedbackModel.findOneAndUpdate(
      { interviewId },
      { $set: data },
      { new: true, upsert: true },
    ),

  updateById: (id: string, interviewId: string, data: FeedbackAI) =>
    FeedbackModel.findOneAndUpdate(
      { _id: id, interviewId },
      { $set: data },
      { new: true },
    ),
};
