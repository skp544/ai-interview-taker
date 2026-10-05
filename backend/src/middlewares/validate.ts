import type { Request, RequestHandler } from "express";
import type { ZodType, z } from "zod";
import type { ValidationIssue } from "../types/api";
import { ApiError } from "../utils/ApiError";

interface RequestSchemas<
  P extends ZodType,
  Q extends ZodType,
  B extends ZodType,
> {
  params?: P;
  query?: Q;
  body?: B;
}

const parts = ["params", "query", "body"] as const;

/**
 * Validates req.params / req.query / req.body against zod schemas and replaces
 * them with the parsed (coerced, defaulted, stripped) values. Failures go to
 * the global error handler as a 400 ApiError with the list of issues.
 *
 * The returned handler is typed from the schemas, so controllers declared as
 * RequestHandler<IdParam, unknown, CreateBody, PaginationQuery> see the parsed types.
 */
export const validate =
  <
    P extends ZodType = ZodType<Request["params"]>,
    Q extends ZodType = ZodType<Request["query"]>,
    B extends ZodType = ZodType<any>,
  >(
    schemas: RequestSchemas<P, Q, B>,
  ): RequestHandler<z.infer<P>, any, z.infer<B>, z.infer<Q>> =>
  (req, _res, next) => {
    const issues: ValidationIssue[] = [];

    for (const part of parts) {
      const schema: ZodType | undefined = schemas[part];
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
