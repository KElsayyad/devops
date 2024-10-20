import app from './config/express/app.js';
import { port } from './config/env/index.js';
import logger from './common/logger/index.js';
import {
  initializeDB,
  closeDBConnection
} from './config/dbConnections/postgresqlConnection.js';

const startServer = async () => {
  const pool = initializeDB();

  process.on('warning', warning =>
    logger.warn(
      `Warning: ${warning.name}: ${warning.message}\nStack Trace: ${warning.stack}`
    )
  );

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      `Unhandled Rejection at: ${JSON.stringify(promise)}, reason: ${reason}, Stack Trace: ${reason.stack}`
    );
  });

  const server = app.listen(port, () => {
    logger.info(`Server is running and listening on port ${port}`);
  });

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    server.close(async () => {
      await closeDBConnection(pool);
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down immediately...');
    server.close(async () => {
      await closeDBConnection(pool);
      process.exit(0);
    });
  });
};

startServer();
