import fs from 'fs';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import db from './db.js';
import { pollMailbox } from './services/emailPoller.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS || 30000);
const storageDir = path.resolve('storage');

app.use(express.json());
app.use('/media', express.static(storageDir));
app.use(express.static('public'));

const sseClients = new Set();

function sendSse(event, payload) {
  const message = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const res of sseClients) {
    res.write(message);
  }
}

function ensureTrapSeed() {
  const existing = db.prepare('SELECT COUNT(*) as count FROM traps').get();
  if (existing.count === 0) {
    const id = nanoid();
    db.prepare('INSERT INTO traps (id, name, email, created_at) VALUES (?, ?, ?, ?)').run(
      id,
      'Основная фотоловушка',
      process.env.DEFAULT_TRAP_EMAIL || 'trap@example.com',
      new Date().toISOString()
    );
    db.prepare(
      'INSERT INTO notification_settings (trap_id, enabled, object_types, actions) VALUES (?, ?, ?, ?)'
    ).run(id, 1, JSON.stringify(['animal', 'person', 'vehicle']), JSON.stringify(['movement']));
  }
}

ensureTrapSeed();

app.get('/api/traps', (req, res) => {
  const traps = db.prepare('SELECT * FROM traps ORDER BY created_at DESC').all();
  res.json(traps);
});

app.post('/api/traps', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  const id = nanoid();
  db.prepare('INSERT INTO traps (id, name, email, created_at) VALUES (?, ?, ?, ?)').run(
    id,
    name,
    email,
    new Date().toISOString()
  );
  db.prepare(
    'INSERT INTO notification_settings (trap_id, enabled, object_types, actions) VALUES (?, ?, ?, ?)'
  ).run(id, 1, JSON.stringify(['animal', 'person', 'vehicle']), JSON.stringify(['movement']));
  res.status(201).json({ id, name, email });
});

app.delete('/api/traps/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM notification_settings WHERE trap_id = ?').run(id);
  db.prepare('DELETE FROM detections WHERE trap_id = ?').run(id);
  db.prepare('DELETE FROM traps WHERE id = ?').run(id);
  res.status(204).end();
});

app.get('/api/traps/:id/settings', (req, res) => {
  const { id } = req.params;
  const row = db.prepare('SELECT * FROM notification_settings WHERE trap_id = ?').get(id);
  if (!row) {
    return res.status(404).json({ error: 'not found' });
  }
  res.json({
    trapId: id,
    enabled: Boolean(row.enabled),
    objectTypes: JSON.parse(row.object_types),
    actions: JSON.parse(row.actions)
  });
});

app.post('/api/traps/:id/settings', (req, res) => {
  const { id } = req.params;
  const { enabled, objectTypes, actions } = req.body;
  db.prepare(
    'UPDATE notification_settings SET enabled = ?, object_types = ?, actions = ? WHERE trap_id = ?'
  ).run(
    enabled ? 1 : 0,
    JSON.stringify(objectTypes || []),
    JSON.stringify(actions || []),
    id
  );
  res.json({ trapId: id, enabled: Boolean(enabled), objectTypes, actions });
});

app.get('/api/detections', (req, res) => {
  const { trapId, mediaType, search } = req.query;
  const conditions = [];
  const params = [];

  if (trapId) {
    conditions.push('trap_id = ?');
    params.push(trapId);
  }
  if (mediaType) {
    conditions.push('media_type LIKE ?');
    params.push(`${mediaType}%`);
  }
  if (search) {
    conditions.push('filename LIKE ?');
    params.push(`%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const detections = db.prepare(
    `SELECT * FROM detections ${where} ORDER BY received_at DESC LIMIT 200`
  ).all(...params);

  const hydrated = detections.map((item) => ({
    ...item,
    media_url: `/media/${item.filepath}`,
    analysis: JSON.parse(item.analysis_json)
  }));

  res.json(hydrated);
});

app.get('/api/detections/:id', (req, res) => {
  const detection = db.prepare('SELECT * FROM detections WHERE id = ?').get(req.params.id);
  if (!detection) {
    return res.status(404).json({ error: 'not found' });
  }
  res.json({
    ...detection,
    media_url: `/media/${detection.filepath}`,
    analysis: JSON.parse(detection.analysis_json)
  });
});

app.get('/api/stream', (req, res) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream'
  });
  res.write('\n');
  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

async function runPoller() {
  const config = {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 993),
    secure: process.env.EMAIL_SECURE !== 'false',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  };

  if (!config.host || !config.user || !config.pass) {
    return;
  }

  try {
    await pollMailbox({
      db,
      config,
      onNewDetection: (payload) => sendSse('detection', payload)
    });
  } catch (error) {
    console.error('Email poll failed:', error.message);
  }
}

setInterval(runPoller, pollIntervalMs);
runPoller();

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

app.listen(port, () => {
  console.log(`Trap detection app listening on http://localhost:${port}`);
});
