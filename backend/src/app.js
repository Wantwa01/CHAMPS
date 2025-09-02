import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/', (req, res) => res.json({ message: 'WeziMediCare API is running' }));

// Routes (use routes index)
app.use('/', routes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;