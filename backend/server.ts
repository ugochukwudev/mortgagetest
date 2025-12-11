import app from './src/app.js';
import env from './src/config/env.js';
import logger from './src/utils/logger.util.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`CORS Origin: ${env.CORS_ORIGIN}`);
});

