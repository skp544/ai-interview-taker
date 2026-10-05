export class ApiError<E = unknown> extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly error?: E,
  ) {
    super(message);
    this.name = "ApiError";
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest<E>(message = "Bad request", error?: E) {
    return new ApiError(400, message, error);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}
