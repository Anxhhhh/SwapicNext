import express from 'express';
import cors from 'cors';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean) as string[];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Routes
import authRoutes from './routes/auth.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import listingRoutes from './routes/listing.routes.js';
import tradeRoutes from './routes/trade.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/trades', tradeRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>SWAPIC Backend API</title>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #FAF7F2;
          color: #35190F;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .card {
          background: white;
          padding: 40px;
          border-radius: 24px;
          border: 1px solid #ede8e1;
          box-shadow: 0 10px 30px rgba(53, 25, 15, 0.05);
          max-width: 520px;
          text-align: center;
        }
        .badge {
          display: inline-block;
          background: #E6F4ED;
          color: #1A8744;
          font-weight: 700;
          font-size: 13px;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 16px;
        }
        h1 {
          margin: 0 0 12px;
          font-size: 26px;
          color: #35190F;
        }
        p {
          color: #654332;
          line-height: 1.6;
          margin: 0 0 24px;
        }
        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        a.btn {
          display: block;
          padding: 12px 20px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }
        .btn-primary {
          background: #E96B16;
          color: white;
        }
        .btn-primary:hover {
          background: #d45d0f;
        }
        .btn-secondary {
          background: #FAF7F2;
          color: #35190F;
          border: 1px solid #ddd5c8;
        }
        .btn-secondary:hover {
          background: #ede8e1;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">● Server Active & Operational</div>
        <h1>Swapic Backend is Running</h1>
        <p>The Express.js REST API is active on <strong>port 5000</strong> and connected to MongoDB.</p>
        <div class="btn-group">
          <a class="btn btn-primary" href="http://localhost:3000">Open Swapic Web App (http://localhost:3000)</a>
          <a class="btn btn-secondary" href="/api/listings">Explore Listings API (/api/listings)</a>
          <a class="btn btn-secondary" href="/health">Health Status (/health)</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Swapic backend is running' });
});

export default app;
