import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('database.sqlite');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
export function initDb() {
  // Companies table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT,
      description TEXT,
      targetRole TEXT,
      workflow TEXT -- JSON string
    )
  `).run();

  // Aptitude Questions table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS aptitude_questions (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      options TEXT, -- JSON string
      answer TEXT NOT NULL,
      topic TEXT NOT NULL
    )
  `).run();

  // Coding Questions table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS coding_questions (
      id TEXT PRIMARY KEY,
      companyId TEXT,
      title TEXT NOT NULL,
      problemStatement TEXT NOT NULL,
      boilerplate TEXT,
      FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
    )
  `).run();

  // Sessions table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      companyId TEXT NOT NULL,
      currentRoundIndex INTEGER DEFAULT 0,
      isRoundSubmitted BOOLEAN DEFAULT 0,
      isFeedbackViewed BOOLEAN DEFAULT 0,
      warnings INTEGER DEFAULT 0,
      isTerminated BOOLEAN DEFAULT 0,
      scores TEXT, -- JSON string
      roundFeedback TEXT,
      FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
    )
  `).run();

  console.log('Database initialized');
}

export default db;
