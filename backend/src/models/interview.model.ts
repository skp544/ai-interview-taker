import mongoose, { InferSchemaType, Schema } from "mongoose";

const interviewSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
    questions: {
      type: [String],
      required: true,
    },
    finalized: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type InterviewDocument = InferSchemaType<typeof interviewSchema> & {
  id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const InterviewModel = mongoose.model<InterviewDocument>(
  "Interview",
  interviewSchema,
);
