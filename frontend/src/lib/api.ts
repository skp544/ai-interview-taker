import type {
  CreateInterviewInput,
  Feedback,
  Interview,
  TranscriptEntry,
  ValidationIssue,
} from "../types";

export const API_URL: string = (
  import.meta.env.VITE_API_URL ?? "http://localhost:5001/api/v1"
).replace(/\/$/, "");

/** Error thrown for any failed API call. */
export class ApiError extends Error {
  readonly status: number;
  readonly issues: ValidationIssue[];

  constructor(message: string, status = 0, issues: ValidationIssue[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
  }

  /** Message plus per-field validation details, if any. */
  get detail(): string {
    if (!this.issues.length) return this.message;
    return `${this.message}: ${this.issues.map((i) => `${i.path} - ${i.message}`).join("; ")}`;
  }
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(
      `Cannot reach the server at ${API_URL}. Is the backend running?`,
    );
  }

  let body: Envelope<T> | null = null;
  try {
    body = (await res.json()) as Envelope<T>;
  } catch {
    /* non-JSON body */
  }

  if (!res.ok || !body || body.success === false) {
    const issues = Array.isArray(body?.error)
      ? (body.error as ValidationIssue[])
      : [];
    throw new ApiError(
      body?.message ?? `Request failed (${res.status})`,
      res.status,
      issues,
    );
  }
  return body.data as T;
}

/** Mongo documents serialise with `_id`; accept either shape. */
type RawInterview = Omit<Interview, "id"> & { id?: string; _id?: string };

function normalizeInterview(raw: RawInterview): Interview {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function listInterviews(
  page = 1,
  limit = 12,
): Promise<Interview[]> {
  const data = await request<RawInterview[]>(
    `/interview?page=${page}&limit=${limit}`,
  );
  return data.map(normalizeInterview);
}

export async function getInterview(id: string): Promise<Interview> {
  return normalizeInterview(await request<RawInterview>(`/interview/${id}`));
}

export async function createInterview(
  input: CreateInterviewInput,
): Promise<Interview> {
  return normalizeInterview(
    await request<RawInterview>("/interview", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  );
}

type RawFeedback = Omit<Feedback, "id" | "interviewId"> & {
  _id?: string;
  interviewId?: string;
};

function normalizeFeedback({ _id, ...raw }: RawFeedback): Feedback {
  return { ...raw, id: _id };
}

/** POST /feedback: generates feedback from the transcript and returns the saved document. */
export async function createFeedback(
  interviewId: string,
  transcript: TranscriptEntry[],
): Promise<Feedback> {
  return normalizeFeedback(
    await request<RawFeedback>("/feedback", {
      method: "POST",
      body: JSON.stringify({ interviewId, transcript }),
    }),
  );
}

/** GET /feedback/interview/:interviewId: responds 404 when none exists yet, mapped to null. */
export async function getFeedbackByInterview(
  interviewId: string,
): Promise<Feedback | null> {
  try {
    return normalizeFeedback(
      await request<RawFeedback>(`/feedback/interview/${interviewId}`),
    );
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
