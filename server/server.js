require('dotenv').config();

const cors = require('cors');
const express = require('express');
const boardingRoutes = require('./routes/boardingRoutes');

const app = express();
const port = process.env.PORT || 5000;

const defaultDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];

const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultDevOrigins, ...configuredOrigins]);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS origin is not allowed.'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BoardMe LK API is running',
  });
});

app.use('/api/boardings', boardingRoutes);

app.use((err, req, res, next) => {
  if (err.message === 'CORS origin is not allowed.') {
    return res.status(403).json({
      success: false,
      message: 'This origin is not allowed to access the API.',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong on the server.',
  });
});

app.listen(port, () => {
  console.log(`BoardMe LK API is running on port ${port}`);
});
