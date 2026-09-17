import { BRAND, callModel, readBody } from './_brand.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const body = await readBody(req);
  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const context = body.context || {};

  const history = incoming
    .filter((m) => m && typeof m.content === 'string' && ['user', 'assistant'].includes(m.role))
    .slice(-10)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

  if (!history.length) return res.status(400).json({ error: 'no_messages' });

  const hints = [];
  if (context.sector) hints.push(`Sector: ${String(context.sector).slice(0, 120)}`);
  if (context.size) hints.push(`Team size: ${String(context.size).slice(0, 40)}`);
  if (context.drain) hints.push(`Where their time goes: ${String(context.drain).slice(0, 400)}`);

  const system = hints.length
    ? `${BRAND}\n\nWHAT THIS VISITOR HAS ALREADY TOLD THE SITE (use it to be specific):\n${hints.join('\n')}`
    : BRAND;

  try {
    const reply = await callModel({
      messages: [{ role: 'system', content: system }, ...history],
      temperature: 0.55,
      maxTokens: 700,
      effort: 'medium',
    });
    if (!reply) return res.status(502).json({ error: 'empty' });
    return res.status(200).json({ reply });
  } catch (e) {
    const code = e.code === 'no_key' ? 503 : 502;
    return res.status(code).json({ error: e.code || 'model_error' });
  }
}
