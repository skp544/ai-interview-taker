import mongoose, { InferSchemaType, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const feedbackSchema = new Schema(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    categoryScore: {
      type: [categorySchema],
      required: true,
    },
    strengths: {
      type: [String],
      required: true,
    },
    areasOfImprovement: {
      type: [String],
      required: true,
    },
    finalAssessment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export type FeedbackDocument = InferSchemaType<typeof feedbackSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const FeedbackModel = mongoose.model<FeedbackDocument>(
  "Feedback",
  feedbackSchema,
);
