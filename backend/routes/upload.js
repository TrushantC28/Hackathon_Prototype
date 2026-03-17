/**
 * Upload Route
 * POST /api/upload — Accepts EDI file and returns parsed segments.
 */

const express = require('express');
const router = express.Router();
const { parseEdi } = require('../parser/ediParser');

router.post('/', (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please upload an EDI file.',
      });
    }

    // Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (req.file.size > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum allowed size is 5MB.',
      });
    }

    // Check file extension
    const allowedExtensions = ['.edi', '.txt', '.x12', '.dat'];
    const filename = req.file.originalname.toLowerCase();
    const hasValidExt = allowedExtensions.some(ext => filename.endsWith(ext));

    if (!hasValidExt) {
      return res.status(400).json({
        success: false,
        error: `Invalid file type. Accepted formats: ${allowedExtensions.join(', ')}`,
      });
    }

    const rawContent = req.file.buffer.toString('utf-8');
    const result = parseEdi(rawContent, req.file.originalname);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to parse EDI file.',
    });
  }
});

module.exports = router;
