// שרת מקומי: node serve.js  ואז http://localhost:4173
// מפתח ה-API של Claude נקרא מקובץ .env (ANTHROPIC_API_KEY=...) ולא נשלח לדפדפן אף פעם.
const http = require('http'), fs = require('fs'), path = require('path');

// tiny .env loader (no dependency): KEY=value per line
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch (e) {}

const { handleOrderText, allow, configured } = require('./ai-order');

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8' };
// only public files are served: never .env, node_modules or server code
const PRIVATE = /(^|[\\/])(\.|node_modules|ai-order\.js|serve\.js|package(-lock)?\.json|api[\\/])/;

http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);

  // lets the page know whether Claude is switched on (true) or it should use the built-in demo parser (false)
  if (u === '/api/ai-status') {
    r.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return r.end(JSON.stringify({ ai: configured() }));
  }

  if (u === '/api/order-ai' && q.method === 'POST') {
    const ip = q.socket.remoteAddress || 'local';
    if (!allow(ip)) { r.writeHead(429, { 'Content-Type': 'application/json' }); return r.end('{"error":"busy"}'); }
    let body = '';
    q.on('data', (c) => { body += c; if (body.length > 4000) q.destroy(); });
    q.on('end', async () => {
      let input = {};
      try { input = JSON.parse(body || '{}'); } catch (e) {}
      const out = await handleOrderText(input);
      r.writeHead(out.status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      r.end(JSON.stringify(out.body));
    });
    return;
  }

  const rel = u === '/' ? 'index.html' : u.replace(/^\/+/, '');
  const f = path.join(__dirname, rel);
  if (!f.startsWith(__dirname) || PRIVATE.test(rel) || !types[path.extname(f)] || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end('not found'); }
  r.writeHead(200, { 'Content-Type': types[path.extname(f)], 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(r);
}).listen(process.env.PORT || 4173, function () { console.log('http://localhost:' + this.address().port); });
