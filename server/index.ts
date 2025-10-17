import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Load environment variables at import time
import { tmdbRoutes } from './routes/tmdb';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tmdb', tmdbRoutes);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler - must come after all routes
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware - must come last
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  if (!process.env.TMDB_API_KEY) {
    console.error('WARNING: TMDB_API_KEY is not set in environment variables!');
    console.error('Please set TMDB_API_KEY in your .env file');
  } else {
    console.log('TMDB_API_KEY loaded successfully');
  }
});