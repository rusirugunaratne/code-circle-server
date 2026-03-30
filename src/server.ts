import app from './app.js';
import { logger } from './utils/logger.js';
import { env } from './config/env.js';

const PORT = env.port || 4000;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
