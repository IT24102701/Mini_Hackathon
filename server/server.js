require('dotenv').config();

const cors = require('cors');
const express = require('express');
const boardingRoutes = require('./routes/boardingRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BoardMe LK API is running',
  });
});

app.use('/api/boardings', boardingRoutes);

app.listen(port, () => {
  console.log(`BoardMe LK API is running on port ${port}`);
});
