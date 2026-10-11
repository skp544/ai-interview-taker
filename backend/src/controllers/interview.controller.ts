import { RequestHandler } from "express";
import type { CreateInterviewBody } from "../schemas/interview.schema";
import type { IdParam, PaginationQuery } from "../schemas/common.schema";
import { interviewRepository } from "../repositories/interview.repository";
import { getRandomInterviewCover } from "../constants";
import { sendSuccess } from "../utils/apiResponse";
import { generateInterviewQuestions } from "../services/openai.service";

export const createInterview: RequestHandler<
  unknown,
  unknown,
  CreateInterviewBody
> = async (req, res) => {
  const { role, type, level, techStack, amount } = req.body;

  const questions = await generateInterviewQuestions({
    role,
    level,
    techStack,
    type,
    amount,
  });

  const interview = await interviewRepository.create({
    role,
    type,
    level,
    techStack: techStack.map((tech) => tech.trim()),
    questions,
    finalized: true,
    coverImage: getRandomInterviewCover(),
  });

  sendSuccess(res, "Interview created successfully", interview, 201);
};

export const listInterviews: RequestHandler<
  unknown,
  unknown,
  unknown,
  PaginationQuery
> = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const interviews = await interviewRepository.list({
    page: Number(page),
    limit: Number(limit),
  });

  sendSuccess(res, "Interviews fetched successfully", interviews);
};

export const getInterviewById: RequestHandler<IdParam> = async (req, res) => {
  const { id } = req.params;

  const interview = await interviewRepository.getById(id);

  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  sendSuccess(res, "Interview fetched successfully", interview);
};
