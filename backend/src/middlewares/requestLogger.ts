import morgan from "morgan";
import { logger } from "../config/logger";

// Pipe morgan's access log lines into winston at the "http" level.
export const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream: { write: (message) => void logger.http(message.trim()) } },
);
