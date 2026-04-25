import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

import chatRoutes from './routes/chat.routes.js';
import sessionRoutes from './routes/session.routes.js';
import quizRoutes from './routes/quiz.routes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Security & logging middleware
app.use(helmet());
app.use(morgan('dev'));

// CORS - Handle multiple origin formats
const clientUrl = process.env.CLIENT_URL || '*';
const isProd = process.env.NODE_ENV === 'production';

const rawOrigins = clientUrl
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

if (!isProd) {
  rawOrigins.push('http://localhost:5173');
}

const allowedOrigins = rawOrigins.map((origin) => origin.replace(/\/$/, ''));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow if no origin (same origin requests)
    if (!origin) return callback(null, true);

    if (clientUrl === '*') return callback(null, true);

    // Normalize URLs (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, '');

    // Allow if it matches
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { error: 'Too many requests, please slow down.' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Elimu AI Server',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/quiz', quizRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Connect to MongoDB then start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed — running without DB:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Elimu AI Server running on port', PORT);
    console.log('🤖 Gemini model: gemini-2.5-flash');
  });
}

startServer();
