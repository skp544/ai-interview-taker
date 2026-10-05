import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import type { ValidationIssue } from "../types/api";
import { ApiError } from "../utils/ApiError";
import { sendError } from "../utils/apiResponse";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode, err.error);
  }

  if (err instanceof ZodError) {
    const issues: ValidationIssue[] = err.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return sendError(res, "Validation failed", 400, issues);
  }

  // body-parser / express errors that carry an HTTP status (e.g. malformed JSON)
  const status = typeof err?.status === "number" ? err.status : undefined;
  if (status && status >= 400 && status < 500) {
    return sendError(
      res,
      status === 400 ? "Invalid request" : err.message,
      status,
    );
  }

  console.error(err);
  return sendError(
    res,
    "Internal server error",
    500,
    env.NODE_ENV === "production" ? undefined : String(err?.stack ?? err),
  );
};
