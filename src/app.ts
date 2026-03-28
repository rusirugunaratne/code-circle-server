import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api', routes);

// Centralized Error Handling
app.use(errorHandler);

export default app;
