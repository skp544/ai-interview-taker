import path from "node:path";
import winston from "winston";
import { env } from "./env";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const isProduction = env.NODE_ENV === "production";
const isTest = env.NODE_ENV === "test";

const consoleFormat = isProduction
  ? combine(timestamp(), errors({ stack: true }), json())
  : combine(
      colorize(),
      timestamp({ format: "HH:mm:ss" }),
      errors({ stack: true }),
      printf(({ timestamp, level, message, stack, ...meta }) => {
        const extra = Object.keys(meta).length
          ? ` ${JSON.stringify(meta)}`
          : "";
        return `${timestamp} ${level}: ${stack ?? message}${extra}`;
      }),
    );

const fileFormat = combine(timestamp(), errors({ stack: true }), json());
const logDir = path.join(process.cwd(), "logs");

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  silent: isTest,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      format: fileFormat,
    }),
  ],
});
