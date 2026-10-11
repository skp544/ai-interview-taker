import { RequestHandler } from "express";
import type { CreateFeedbackInput } from "../schemas/feedback.schema";
import type { InterviewIdParam } from "../schemas/common.schema";
import { feedbackRepository } from "../repositories/feedback.repository";
import { interviewRepository } from "../repositories/interview.repository";
import { generateFeedbackFromTranscript } from "../services/openai.service";
import { sendSuccess } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

export const createFeedback: RequestHandler<
  unknown,
  unknown,
  CreateFeedbackInput
> = async (req, res) => {
  const { interviewId, transcript, feedbackId } = req.body;

  const interview = await interviewRepository.getById(interviewId);
  if (!interview) throw ApiError.notFound("Interview not found");

  const formattedTranscript = transcript
    .map(({ role, content }) => `${role}: ${content}`)
    .join("\n");

  const result = await generateFeedbackFromTranscript(formattedTranscript);

  const feedback = feedbackId
    ? await feedbackRepository.updateById(feedbackId, interviewId, result)
    : await feedbackRepository.upsertByInterviewId(interviewId, result);

  if (!feedback) throw ApiError.notFound("Feedback not found");

  sendSuccess(res, "Feedback generated successfully", feedback, 201);
};

export const getFeedbackByInterview: RequestHandler<InterviewIdParam> = async (
  req,
  res,
) => {
  const feedback = await feedbackRepository.findByInterviewId(
    req.params.interviewId,
  );
  if (!feedback) throw ApiError.notFound("Feedback not found");

  sendSuccess(res, "Feedback fetched successfully", feedback);
};
