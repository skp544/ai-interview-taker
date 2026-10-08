import { Router } from "express";
import {
  createInterview,
  listInterviews,
  getInterviews,
} from "../controllers/interview.controller";

const interviewRouter: Router = Router();

interviewRouter.post("/", createInterview);

interviewRouter.get("/", getInterviews);

interviewRouter.get("/list", listInterviews);

export default interviewRouter;
