import OpenAI from "openai";
import { env } from "../config/env";

import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export interface GenerateQuestionsInput {
  role: string;
  level: string;
  techStack: string[];
  type: string;
  amount: number;
}

export async function generateInterviewQuestions(
  input: GenerateQuestionsInput,
): Promise<string[]> {
  const { role, level, techStack, type, amount } = input;

  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL!,
    messages: [
      {
        role: "user",
        content: `Prepare questions for a job interview.
                The jobs role is ${role}.
                The job experience level is ${level}.
                The tech stack used in the job is: ${techStack.join(", ")}.
                The focus between behavioural and technical questions should lean towards: ${type}.
                The amount of questions required is ${amount}.
                Please return only the questions, without any additonal text.
                The questions are going to be read by a voice assistant so do not use "/" or "*" 
                or any other special characters which might break the voice assistant.
                Return the questions formatted like this:
                ["Question 1", "Question 2", "Question 3"]`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim();

  if (!raw) throw new Error("OpenAI returned empty questions list");

  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed) || !parsed.every((q) => typeof q === "string"))
    throw new Error("OpenAI returned invalid questions format");

  return parsed;
}
