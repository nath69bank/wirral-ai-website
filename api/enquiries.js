import { put, list } from '@vercel/blob';
import { readBody } from './_brand.js';

const PREFIX = 'enquiries/';
const MAX_LIST = 500;

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function checkToken(req) {
  const token = req.headers['x-dashboard-token'];
  return Boolean(process.env.DASHBOARD_TOKEN) && token === process.env.DASHBOARD_TOKEN;
}

async function findBlobById(id) {
  const { blobs } = await list({ prefix: PREFIX, limit: MAX_LIST });
  return blobs.find((b) => b.pathname.includes(id));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-dashboard-token');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  /* ---------------------------------------------------- POST — new lead */
  if (req.method === 'POST') {
    const body = await readBody(req);
    const service = String(body.service || '').slice(0, 40).trim();
    if (!service) return res.status(400).json({ error: 'missing_service' });

    const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
    // Cap payload size defensively — this is a form submission, not a file upload.
    const answersStr = JSON.stringify(answers);
    if (answersStr.length > 20000) return res.status(413).json({ error: 'payload_too_large' });

    const record = {
      id: genId(),
      service,
      serviceLabel: String(body.serviceLabel || '').slice(0, 60),
      answers,
      summary: Array.isArray(body.summary) ? body.summary.slice(0, 200) : [],
      submittedAt: new Date().toISOString(),
      page: String(body.page || '').slice(0, 300),
      status: 'new',
    };

    try {
      const key = `${PREFIX}${record.submittedAt.replace(/[:.]/g, '-')}-${record.id}.json`;
      await put(key, JSON.stringify(record), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });
      return res.status(200).json({ ok: true, id: record.id });
    } catch (e) {
      const missing = /no token|BLOB_READ_WRITE_TOKEN/i.test(String(e && e.message));
      return res.status(503).json({ error: missing ? 'blob_not_configured' : 'storage_unavailable' });
    }
  }

  /* ---------------------------------------------- GET — dashboard listing */
  if (req.method === 'GET') {
    if (!checkToken(req)) return res.status(401).json({ error: 'unauthorized' });
    try {
      const { blobs } = await list({ prefix: PREFIX, limit: MAX_LIST });
      const sorted = blobs
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .slice(0, 300);
      const records = await Promise.all(
        sorted.map(async (b) => {
          try {
            const r = await fetch(b.url);
            if (!r.ok) return null;
            return await r.json();
          } catch {
            return null;
          }
        })
      );
      return res.status(200).json({ enquiries: records.filter(Boolean) });
    } catch (e) {
      const missing = /no token|BLOB_READ_WRITE_TOKEN/i.test(String(e && e.message));
      return res.status(503).json({ error: missing ? 'blob_not_configured' : 'storage_unavailable' });
    }
  }

  /* ------------------------------------------------- PATCH — mark status */
  if (req.method === 'PATCH') {
    if (!checkToken(req)) return res.status(401).json({ error: 'unauthorized' });
    const body = await readBody(req);
    const id = String(body.id || '').trim();
    const status = String(body.status || '').trim();
    if (!id || !['new', 'contacted', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'missing_or_invalid_fields' });
    }
    try {
      const match = await findBlobById(id);
      if (!match) return res.status(404).json({ error: 'not_found' });
      const r = await fetch(match.url);
      const record = await r.json();
      record.status = status;
      await put(match.pathname, JSON.stringify(record), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
        allowOverwrite: true,
      });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(503).json({ error: 'storage_unavailable' });
    }
  }

  return res.status(405).json({ error: 'method_not_allowed' });
}
