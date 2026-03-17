/**
 * AI Route
 * POST /api/ai/explain — Returns AI placeholder explanation.
 */

const express = require('express');
const router = express.Router();
const { getExplanation } = require('../ai/aiService');

router.post('/explain', (req, res) => {
  try {
    const { error, segment } = req.body || {};
    const explanation = getExplanation(error, segment);

    return res.json({
      success: true,
      data: explanation,
    });
  } catch (err) {
    console.error('AI explain error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate AI explanation.',
    });
  }
});

module.exports = router;
