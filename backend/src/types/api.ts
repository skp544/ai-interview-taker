export interface SuccessResponse<T = null> {
  success: true;
  message: string;
  data?: T;
}

export interface ErrorResponse<E = null> {
  success: false;
  message: string;
  error?: E;
}

export interface ValidationIssue {
  path: string;
  message: string;
}
