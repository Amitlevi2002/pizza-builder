// Vercel serverless function: POST /api/order-ai  (same logic as the local server)
const { handleOrderText, allow } = require('../ai-order');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method' }); return; }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'anon';
  if (!allow(ip)) { res.status(429).json({ error: 'busy' }); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const out = await handleOrderText(body || {});
  res.setHeader('Cache-Control', 'no-store');
  res.status(out.status).json(out.body);
};
