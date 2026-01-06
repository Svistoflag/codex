import fs from 'fs';
import path from 'path';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import { analyzeMedia, buildPublicName } from './analyzer.js';

const storageDir = path.resolve('storage');

function ensureStorage() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
}

function buildClient(config) {
  return new ImapFlow({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });
}

async function getTrapIdForMessage(db, message) {
  const toAddresses = (message.to?.value || []).map((item) => item.address?.toLowerCase());
  if (toAddresses.length > 0) {
    const stmt = db.prepare('SELECT id FROM traps WHERE lower(email) = ?');
    for (const address of toAddresses) {
      if (!address) {
        continue;
      }
      const row = stmt.get(address);
      if (row) {
        return row.id;
      }
    }
  }

  const fallback = db.prepare('SELECT id FROM traps ORDER BY created_at LIMIT 1').get();
  return fallback?.id ?? null;
}

function saveAttachment({ attachment, trapId, db }) {
  const id = nanoid();
  const safeName = buildPublicName(attachment.filename, id);
  const extension = path.extname(safeName);
  const storedName = `${id}${extension}`;
  const filePath = path.join(storageDir, storedName);
  fs.writeFileSync(filePath, attachment.content);

  const mediaType = mime.lookup(safeName) || attachment.contentType || 'application/octet-stream';
  const analysis = analyzeMedia({ filename: safeName });

  db.prepare(
    `INSERT INTO detections (id, trap_id, filename, filepath, media_type, received_at, analysis_json, source_message_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    trapId,
    safeName,
    storedName,
    mediaType,
    new Date().toISOString(),
    JSON.stringify(analysis),
    attachment.cid || safeName
  );

  return { id, filename: safeName, storedName, mediaType, analysis };
}

export async function pollMailbox({ db, config, onNewDetection }) {
  ensureStorage();
  const client = buildClient(config);

  await client.connect();
  const lock = await client.getMailboxLock('INBOX');

  try {
    const messageIds = [];
    for await (const message of client.fetch('1:*', { uid: true, flags: true })) {
      if (!message.flags?.includes('\\Seen')) {
        messageIds.push(message.uid);
      }
    }

    if (messageIds.length === 0) {
      return;
    }

    for await (const message of client.fetch(messageIds, { uid: true, source: true })) {
      const parsed = await simpleParser(message.source);
      const trapId = await getTrapIdForMessage(db, parsed);

      if (!trapId) {
        continue;
      }

      const attachments = parsed.attachments || [];
      for (const attachment of attachments) {
        const detection = saveAttachment({ attachment, trapId, db });
        if (onNewDetection) {
          onNewDetection({
            ...detection,
            trapId,
            receivedAt: new Date().toISOString()
          });
        }
      }

      await client.messageFlagsAdd(message.uid, ['\\Seen']);
    }
  } finally {
    lock.release();
    await client.logout();
  }
}
