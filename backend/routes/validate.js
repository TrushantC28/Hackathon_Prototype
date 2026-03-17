/**
 * Validate Route
 * POST /api/validate — Runs validation on parsed segments and returns errors.
 */

const express = require('express');
const router = express.Router();
const { validate } = require('../validator/validator');
const { parseEdi } = require('../parser/ediParser');

router.post('/', (req, res) => {
  try {
    let segments;

    // Accept either parsed segments or a raw file
    if (req.file) {
      const rawContent = req.file.buffer.toString('utf-8');
      const parsed = parseEdi(rawContent, req.file.originalname);
      segments = parsed.segments;
    } else if (req.body && req.body.segments) {
      segments = req.body.segments;
    } else {
      return res.status(400).json({
        success: false,
        error: 'No segments or file provided for validation.',
      });
    }

    const result = validate(segments);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('Validation error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Validation failed.',
    });
  }
});

module.exports = router;
