const app = require('./src/app');
const connectDB = require('./src/config/db.config');
const { PORT } = require('./src/config/env');
const logger = require('./src/utils/logger');

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`AI Writer Copilot backend running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

start();
