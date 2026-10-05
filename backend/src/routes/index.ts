import { Router } from "express";
import healthRoutes from "./health.routes";
import interviewRouter from "./interview.routes";
import feedbackRouter from "./feedback.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/interview", interviewRouter);
router.use("/feedback", feedbackRouter);

export default router;
