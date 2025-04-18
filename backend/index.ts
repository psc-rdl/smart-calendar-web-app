import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import authRoutes from './routes/auth';
import './services/passport';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.post('/api/schedule', (req, res) => {
  const input = req.body;
  const scriptPath = path.join(__dirname, 'scheduler.py');

  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing Python script:', error);
      return res.status(500).json({ error: 'Script failed' });
    }

    res.json({ message: 'Scheduled!', output: stdout });
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});