export interface Interview {
  id: string;
  role: string;
  type: string;
  level: string;
  techStack: string[];
  questions: string[];
  finalized: boolean;
  coverImage: string;
  createdAt: string;
}

export interface CreateInterviewInput {
  role: string;
  type: string;
  level: string;
  techStack: string[];
  amount: number;
}

export const FEEDBACK_CATEGORIES = [
  "Communication Skills",
  "Technical Knowledge",
  "Problem Solving",
  "Cultural Fit",
  "Confidence and Clarity",
] as const;

export interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

export interface Feedback {
  id?: string;
  interviewId?: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt?: string;
}

export interface TranscriptEntry {
  role: "assistant" | "user";
  content: string;
}

export interface ValidationIssue {
  path: string;
  message: string;
}
