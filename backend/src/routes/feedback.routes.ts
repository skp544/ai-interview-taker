import { Router } from "express";
import {
  createFeedback,
  getFeedbackByInterview,
} from "../controllers/feedback.controller";
import { validate } from "../middlewares/validate";
import { interviewIdParamSchema } from "../schemas/common.schema";
import { createFeedbackSchema } from "../schemas/feedback.schema";

const feedbackRouter: Router = Router();

feedbackRouter.post(
  "/",
  validate({ body: createFeedbackSchema }),
  createFeedback,
);

feedbackRouter.get(
  "/interview/:interviewId",
  validate({ params: interviewIdParamSchema }),
  getFeedbackByInterview,
);

export default feedbackRouter;
