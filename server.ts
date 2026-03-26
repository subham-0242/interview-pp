import express from 'express';
import { createServer as createViteServer } from 'vite';
import db, { initDb } from './src/db/index.js';
import cors from 'cors';

// Initialize DB
initDb();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Companies
  app.get('/api/companies', (req, res) => {
    const companies = db.prepare('SELECT * FROM companies').all();
    res.json(companies.map((c: any) => ({
      ...c,
      workflow: JSON.parse(c.workflow || '[]')
    })));
  });

  app.post('/api/companies', (req, res) => {
    const { id, name, logo, description, targetRole, workflow } = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO companies (id, name, logo, description, targetRole, workflow)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, logo, description, targetRole, JSON.stringify(workflow));
    res.json({ success: true });
  });

  app.delete('/api/companies/:id', (req, res) => {
    db.prepare('DELETE FROM companies WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Aptitude Questions
  app.get('/api/aptitude', (req, res) => {
    const questions = db.prepare('SELECT * FROM aptitude_questions').all();
    res.json(questions.map((q: any) => ({
      ...q,
      options: JSON.parse(q.options || '[]')
    })));
  });

  app.post('/api/aptitude/bulk', (req, res) => {
    const questions = req.body;
    const insert = db.prepare(`
      INSERT OR REPLACE INTO aptitude_questions (id, question, options, answer, topic)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const transaction = db.transaction((qs) => {
      for (const q of qs) {
        insert.run(q.id, q.question, JSON.stringify(q.options), q.answer, q.topic);
      }
    });
    
    transaction(questions);
    res.json({ success: true });
  });

  // Coding Questions
  app.get('/api/coding', (req, res) => {
    const questions = db.prepare('SELECT * FROM coding_questions').all();
    res.json(questions);
  });

  app.post('/api/coding', (req, res) => {
    const { id, companyId, title, problemStatement, boilerplate } = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO coding_questions (id, companyId, title, problemStatement, boilerplate)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, companyId, title, problemStatement, boilerplate);
    res.json({ success: true });
  });

  app.delete('/api/coding/:id', (req, res) => {
    db.prepare('DELETE FROM coding_questions WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Sessions
  app.get('/api/sessions/:userId', (req, res) => {
    const session = db.prepare('SELECT * FROM sessions WHERE userId = ?').get(req.params.userId);
    if (session) {
      res.json({
        ...session,
        isRoundSubmitted: !!session.isRoundSubmitted,
        isFeedbackViewed: !!session.isFeedbackViewed,
        isTerminated: !!session.isTerminated,
        scores: JSON.parse(session.scores || '{}')
      });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  });

  app.post('/api/sessions', (req, res) => {
    const { id, userId, companyId, currentRoundIndex, isRoundSubmitted, isFeedbackViewed, warnings, isTerminated, scores, roundFeedback } = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO sessions (id, userId, companyId, currentRoundIndex, isRoundSubmitted, isFeedbackViewed, warnings, isTerminated, scores, roundFeedback)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, userId, companyId, currentRoundIndex, 
      isRoundSubmitted ? 1 : 0, 
      isFeedbackViewed ? 1 : 0, 
      warnings, 
      isTerminated ? 1 : 0, 
      JSON.stringify(scores), 
      roundFeedback
    );
    res.json({ success: true });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
