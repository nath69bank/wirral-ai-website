import { z } from 'zod';
import { BRAND, callModelJSON, readBody } from './_brand.js';

const OpportunitiesSchema = z.object({
  opportunities: z.array(
    z.object({
      title: z.string(),
      why: z.string(),
      area: z.string(),
      effort: z.string(),
    })
  ),
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const body = await readBody(req);
  const sector = String(body.sector || '').slice(0, 160).trim();
  const size = String(body.size || '').slice(0, 40).trim();
  const drain = String(body.drain || '').slice(0, 900).trim();
  if (!sector || !drain) return res.status(400).json({ error: 'missing_fields' });

  const instruction = `A visitor to the wirral.ai site has described their organisation. Identify the
three most plausible places AI could genuinely help them.

Sector or trade: ${sector}
Team size: ${size}
Where their time goes: ${drain}

Rules:
- Ground every suggestion in what they actually described. No generic filler.
- At least one suggestion should be about capability, governance or safe use rather than building software,
  unless what they described makes that clearly irrelevant.
- Do not invent metrics, percentages, savings figures or timescales.
- "area" must be exactly one of: Consulting, Implementation, Automation, Capability.
- "effort" must be exactly one of: Low effort, Medium effort, Higher effort.
- "why" is 2 sentences, max 40 words, British English, plain and specific. Describe the business
  outcome, not the technology.
- "title" is max 8 words, sentence case, no marketing language.

Return JSON only, exactly this shape:
{"opportunities":[{"title":"...","why":"...","area":"...","effort":"..."}]}`;

  try {
    const parsed = await callModelJSON({
      messages: [
        { role: 'system', content: `${BRAND}\n\nYou are now acting as a structured analysis engine. Output JSON only.` },
        { role: 'user', content: instruction },
      ],
      temperature: 0.4,
      maxTokens: 700,
      schema: OpportunitiesSchema,
    });
    const ops = (parsed.opportunities || [])
      .filter((o) => o && o.title && o.why)
      .slice(0, 3)
      .map((o) => ({
        title: String(o.title).slice(0, 90),
        why: String(o.why).slice(0, 320),
        area: ['Consulting', 'Implementation', 'Automation', 'Capability'].includes(o.area)
          ? o.area
          : 'Implementation',
        effort: ['Low effort', 'Medium effort', 'Higher effort'].includes(o.effort)
          ? o.effort
          : 'Medium effort',
      }));
    if (!ops.length) return res.status(502).json({ error: 'empty' });
    return res.status(200).json({ opportunities: ops });
  } catch (e) {
    const code = e.code === 'no_key' ? 503 : 502;
    return res.status(code).json({ error: e.code || 'model_error' });
  }
}
