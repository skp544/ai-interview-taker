import type { Response } from "express";
import type { ErrorResponse, SuccessResponse } from "../types/api";

export const sendSuccess = <T = null>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
): Response<SuccessResponse<T>> => {
  const body: SuccessResponse<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
};

export const sendCreated = <T = null>(
  res: Response,
  message: string,
  data?: T,
) => sendSuccess(res, message, data, 201);

export const sendError = <E = null>(
  res: Response,
  message: string,
  statusCode = 500,
  error?: E,
): Response<ErrorResponse<E>> => {
  const body: ErrorResponse<E> = { success: false, message };
  if (error !== undefined) body.error = error;
  return res.status(statusCode).json(body);
};
