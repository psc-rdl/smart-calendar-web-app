import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Example route
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Route to eventually call your Python scheduler
app.post('/api/schedule', (req, res) => {
  const input = req.body;

  // Placeholder: You would pass data to your Python script here
  exec('python3 backend/scheduler.py', (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing Python script:', error);
      return res.status(500).json({ error: 'Script failed' });
    }

    res.json({ message: 'Scheduled!', output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});