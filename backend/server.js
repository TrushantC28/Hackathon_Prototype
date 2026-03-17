/**
 * X12Guard Backend Server
 * Express server with file upload support and EDI processing routes.
 */

import cors from "cors";

app.use(cors({
  origin: "*"
}));
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Multer config for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Import routes
const uploadRoute = require('./routes/upload');
const validateRoute = require('./routes/validate');
const aiRoute = require('./routes/ai');

// Mount routes
app.use('/api/upload', upload.single('file'), uploadRoute);
app.use('/api/validate', upload.single('file'), validateRoute);
app.use('/api/ai', aiRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'X12Guard Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum allowed size is 5MB.',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error.',
  });
});

app.listen(PORT, () => {
  console.log(`🛡️  X12Guard Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
