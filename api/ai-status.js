// Vercel serverless function: GET /api/ai-status -> { ai: true } when ANTHROPIC_API_KEY is set in the project settings
const { configured } = require('../ai-order');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ai: configured() });
};
