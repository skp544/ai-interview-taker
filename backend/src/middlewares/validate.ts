import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import type { ValidationIssue } from "../types/api";
import { ApiError } from "../utils/ApiError";

interface RequestSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

const parts = ["body", "query", "params"] as const;

/**
 * Validates req.body / req.query / req.params against zod schemas and replaces
 * them with the parsed (coerced, stripped) values. Failures go to the global
 * error handler as a 400 ApiError with the list of issues.
 */
export const validate =
  (schemas: RequestSchemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const issues: ValidationIssue[] = [];

    for (const part of parts) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(req[part]);
      if (!result.success) {
        for (const issue of result.error.issues) {
          issues.push({
            path: [part, ...issue.path].join("."),
            message: issue.message,
          });
        }
        continue;
      }

      // Express 5 exposes req.query as a getter-only property, so redefine it.
      Object.defineProperty(req, part, {
        value: result.data,
        writable: true,
        configurable: true,
      });
    }

    if (issues.length > 0)
      return next(ApiError.badRequest("Validation failed", issues));
    next();
  };
