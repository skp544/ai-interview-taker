import { Router } from "express";
import {
  createInterview,
  getInterviewById,
  listInterviews,
} from "../controllers/interview.controller";
import { validate } from "../middlewares/validate";
import { createInterviewSchema } from "../schemas/interview.schema";
import { idParamSchema, paginationQuerySchema } from "../schemas/common.schema";

const interviewRouter: Router = Router();

interviewRouter.post(
  "/",
  validate({ body: createInterviewSchema }),
  createInterview,
);

interviewRouter.get(
  "/",
  validate({ query: paginationQuerySchema }),
  listInterviews,
);

interviewRouter.get(
  "/:id",
  validate({ params: idParamSchema }),
  getInterviewById,
);

export default interviewRouter;
