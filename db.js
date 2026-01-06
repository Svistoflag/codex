import Database from 'better-sqlite3';

const db = new Database('data.sqlite');

db.pragma('journal_mode = WAL');

const migrations = [
  `CREATE TABLE IF NOT EXISTS traps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS detections (
    id TEXT PRIMARY KEY,
    trap_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    media_type TEXT NOT NULL,
    received_at TEXT NOT NULL,
    analysis_json TEXT NOT NULL,
    source_message_id TEXT NOT NULL,
    FOREIGN KEY(trap_id) REFERENCES traps(id)
  );`,
  `CREATE TABLE IF NOT EXISTS notification_settings (
    trap_id TEXT PRIMARY KEY,
    enabled INTEGER NOT NULL,
    object_types TEXT NOT NULL,
    actions TEXT NOT NULL,
    FOREIGN KEY(trap_id) REFERENCES traps(id)
  );`
];

for (const migration of migrations) {
  db.exec(migration);
}

export default db;
