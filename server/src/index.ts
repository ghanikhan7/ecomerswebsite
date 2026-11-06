import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/paymentRoutes.js';
import { isRazorpayConfigured, logRazorpayDiagnostics } from './config/razorpay.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middlewares
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Request logger for development
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ABAYA ATTIRE OFFICIAL Payment Server',
    razorpayTestMode: true,
    razorpayKeysConfigured: isRazorpayConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Payment API routes
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const errorMessage = err instanceof Error ? err.message : 'Internal server error';
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: errorMessage,
  });
});

// Start listening if not in test or serverless environment
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`═══════════════════════════════════════════════════════════`);
    console.log(`  ABAYA ATTIRE OFFICIAL — Payment Gateway Server`);
    console.log(`  Port:             http://localhost:${PORT}`);
    console.log(`  Razorpay Mode:    TEST MODE`);
    console.log(`  Keys Configured:  ${isRazorpayConfigured() ? 'YES (Live Test API)' : 'NO (Using Simulator)'}`);
    logRazorpayDiagnostics();
    console.log(`═══════════════════════════════════════════════════════════`);
  });
}

export default app;
