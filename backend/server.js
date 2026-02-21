import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// DB setup
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'tarify.db');
import fs from 'fs';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    answer TEXT NOT NULL CHECK(answer IN ('yes','partly','no')),
    page TEXT DEFAULT 'home',
    user_agent TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS cookie_consent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consent TEXT NOT NULL CHECK(consent IN ('accept','reject','necessary')),
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS search_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile TEXT,
    budget INTEGER,
    internet INTEGER,
    minutes INTEGER,
    results_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_feedback_date ON feedback(created_at);
  CREATE INDEX IF NOT EXISTS idx_pageviews_date ON page_views(created_at);
  CREATE INDEX IF NOT EXISTS idx_search_date ON search_queries(created_at);
`);

// Middleware
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '1mb' }));

// Rate limiting (simple in-memory)
const rateLimits = new Map();
function rateLimit(key, maxPerMinute = 30) {
  const now = Date.now();
  const windowMs = 60000;
  if (!rateLimits.has(key)) rateLimits.set(key, []);
  const hits = rateLimits.get(key).filter(t => now - t < windowMs);
  if (hits.length >= maxPerMinute) return false;
  hits.push(now);
  rateLimits.set(key, hits);
  return true;
}

// Clean old rate limit entries every 5 min
setInterval(() => {
  const now = Date.now();
  for (const [key, hits] of rateLimits.entries()) {
    const valid = hits.filter(t => now - t < 60000);
    if (valid.length === 0) rateLimits.delete(key);
    else rateLimits.set(key, valid);
  }
}, 300000);

function getIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
}

// ============ API ROUTES ============

// POST /api/feedback - save user feedback
app.post('/api/feedback', (req, res) => {
  const ip = getIP(req);
  if (!rateLimit(ip + ':feedback', 10)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  const { answer, page } = req.body;
  if (!['yes', 'partly', 'no'].includes(answer)) {
    return res.status(400).json({ error: 'Invalid answer' });
  }
  
  try {
    const stmt = db.prepare('INSERT INTO feedback (answer, page, user_agent, ip) VALUES (?, ?, ?, ?)');
    stmt.run(answer, page || 'home', req.headers['user-agent'] || '', ip);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cookie-consent
app.post('/api/cookie-consent', (req, res) => {
  const ip = getIP(req);
  if (!rateLimit(ip + ':cookie', 5)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  const { consent } = req.body;
  if (!['accept', 'reject', 'necessary'].includes(consent)) {
    return res.status(400).json({ error: 'Invalid consent value' });
  }
  
  try {
    const stmt = db.prepare('INSERT INTO cookie_consent (consent, ip) VALUES (?, ?)');
    stmt.run(consent, ip);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/pageview
app.post('/api/pageview', (req, res) => {
  const ip = getIP(req);
  if (!rateLimit(ip + ':pv', 60)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  const { page, referrer } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO page_views (page, referrer, user_agent, ip) VALUES (?, ?, ?, ?)');
    stmt.run(page || '', referrer || '', req.headers['user-agent'] || '', ip);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/search-log
app.post('/api/search-log', (req, res) => {
  const ip = getIP(req);
  if (!rateLimit(ip + ':search', 30)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  const { profile, budget, internet, minutes, results_count } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO search_queries (profile, budget, internet, minutes, results_count) VALUES (?, ?, ?, ?, ?)');
    stmt.run(profile || '', budget || 0, internet || 0, minutes || 0, results_count || 0);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ ADMIN API (password protected) ============

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tarify2026admin';

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  if (token !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(403).json({ error: 'Wrong password' });
  }
});

// GET /api/admin/stats
app.get('/api/admin/stats', adminAuth, (req, res) => {
  try {
    // Feedback stats
    const feedbackTotal = db.prepare('SELECT COUNT(*) as cnt FROM feedback').get();
    const feedbackByAnswer = db.prepare(
      "SELECT answer, COUNT(*) as cnt FROM feedback GROUP BY answer"
    ).all();
    const feedbackRecent = db.prepare(
      "SELECT * FROM feedback ORDER BY created_at DESC LIMIT 50"
    ).all();
    const feedbackByDay = db.prepare(`
      SELECT date(created_at) as day, answer, COUNT(*) as cnt 
      FROM feedback 
      WHERE created_at >= date('now', '-30 days')
      GROUP BY day, answer 
      ORDER BY day
    `).all();

    // Page views
    const viewsTotal = db.prepare('SELECT COUNT(*) as cnt FROM page_views').get();
    const viewsByPage = db.prepare(
      "SELECT page, COUNT(*) as cnt FROM page_views GROUP BY page ORDER BY cnt DESC LIMIT 20"
    ).all();
    const viewsByDay = db.prepare(`
      SELECT date(created_at) as day, COUNT(*) as cnt 
      FROM page_views 
      WHERE created_at >= date('now', '-30 days')
      GROUP BY day ORDER BY day
    `).all();

    // Search stats
    const searchTotal = db.prepare('SELECT COUNT(*) as cnt FROM search_queries').get();
    const searchByProfile = db.prepare(
      "SELECT profile, COUNT(*) as cnt FROM search_queries GROUP BY profile ORDER BY cnt DESC"
    ).all();
    const avgBudget = db.prepare('SELECT AVG(budget) as avg FROM search_queries WHERE budget > 0').get();
    const avgInternet = db.prepare('SELECT AVG(internet) as avg FROM search_queries WHERE internet > 0').get();

    // Cookie consent
    const consentStats = db.prepare(
      "SELECT consent, COUNT(*) as cnt FROM cookie_consent GROUP BY consent"
    ).all();

    res.json({
      feedback: {
        total: feedbackTotal.cnt,
        byAnswer: feedbackByAnswer,
        recent: feedbackRecent,
        byDay: feedbackByDay,
      },
      pageViews: {
        total: viewsTotal.cnt,
        byPage: viewsByPage,
        byDay: viewsByDay,
      },
      search: {
        total: searchTotal.cnt,
        byProfile: searchByProfile,
        avgBudget: avgBudget?.avg || 0,
        avgInternet: avgInternet?.avg || 0,
      },
      consent: consentStats,
    });
  } catch (e) {
    console.error('Admin stats error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ SERVE FRONTEND (production) ============

const frontendPath = path.join(__dirname, 'public');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
  
  // SPA fallback
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
