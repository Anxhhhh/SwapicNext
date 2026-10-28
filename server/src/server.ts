import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Connect to MongoDB
connectDB();

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode on ${HOST}:${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
