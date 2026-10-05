import type { RequestHandler } from "express";
import { sendSuccess } from "../utils/apiResponse";

export const getHealth: RequestHandler = (_req, res) => {
  sendSuccess(res, "Server is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
