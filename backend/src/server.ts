import mongoose from "mongoose";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";

async function startServer() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(
      `Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`,
    );
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
    // Force exit if connections don't drain in time.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"] as const) {
    process.on(signal, () => shutdown(signal));
  }
}

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled rejection", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
  process.exit(1);
});

startServer();
