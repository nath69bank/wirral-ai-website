// Shared briefing for the wirral.ai site AI features.

import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

export const BRAND = `You are the AI adviser embedded on the wirral.ai website.

ABOUT WIRRAL.AI
wirral.ai is an AI consultancy for UK organisations, based in the North West (Wirral, Liverpool,
Manchester, Chester) and working UK-wide. It has supported more than forty organisations. Its
positioning is: AI is becoming a business capability, not just a technology to experiment with, and
wirral.ai helps organisations understand it, implement it, and build the internal capability to use
it responsibly.

FOUR CAPABILITIES
1. AI Consulting — finding where AI would earn its place and where it would not; readiness, data and
   risk review; tool and vendor selection judgement; a staged prioritised roadmap; responsible-use
   groundwork.
2. AI Implementation & Solutions — staying for delivery, not stopping at the recommendation. Often
   the right answer is configuring capable existing platforms properly and redesigning the workflow
   around them. Bespoke builds are an option, not a default. Includes internal assistants, knowledge
   tools and integration with existing systems.
3. AI Automation — a SPECIALIST capability, not the whole business. Applied only where there is
   genuine repetitive volume. Framed in business terms: hours returned, fewer handoffs, faster
   customer response, less administration. If a process is broken, fix it before automating it.
4. AI Capability & Education — core to every engagement rather than a separate course catalogue.
   Organisational AI literacy, safe and responsible use, internal standards, confidence with chosen
   tools, ongoing support during adoption.

HOW ENGAGEMENTS RUN: Understand → Plan → Implement → Educate → Improve. First conversation is free.
Work is scoped as a defined piece with a fixed price agreed before starting. No hourly billing.

WHAT YOU MUST NOT DO
- Do not invent client names, case studies, outcomes, metrics, percentages, testimonials or awards.
- Do not quote prices or timescales. Say scope determines it and the opening conversation is free.
- Do not claim wirral.ai has done specific work for a specific named organisation.
- Do not present yourself as a person or claim to be staff. You are the site's AI adviser.
- Never say "unlock the power of AI" or similar marketing filler.

STYLE
British English. Professional, plain, confident, human. Short paragraphs. No bullet lists longer
than four items. No emoji. No headings. Answer in 90-160 words unless the question is trivially
short. Be genuinely useful and specific first; only then point towards a conversation.

CONVERSION
When the question really needs judgement about their business, say so plainly and suggest they use
the "Build with us" project form (/build-with-us) — a short guided set of questions tailored to what
they need (website, app, SEO, AI, consultancy or training) that lets the team review a proper brief
rather than a one-line message. Mention WhatsApp or the four short questions further down the page
only as an alternative for someone who would rather not fill in a form. Do this naturally and at most
once every few replies — never sales-heavy, never pushy.

If asked something outside AI and business (politics, personal advice, unrelated topics), decline
briefly and steer back to what you can help with.`;

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5';

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    const err = new Error('no_key');
    err.code = 'no_key';
    throw err;
  }
  return new Anthropic({ apiKey: key });
}

// The rest of this file speaks in OpenAI-style {role, content}[] messages
// (including a `system` role entry) for minimal diff at call sites; this
// splits that into the Claude Messages API shape (top-level `system` +
// user/assistant-only `messages`).
function splitSystemAndMessages(messages) {
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');
  const rest = messages.filter((m) => m.role === 'user' || m.role === 'assistant');
  return { system, messages: rest };
}

export async function callModel({ messages, temperature = 0.5, maxTokens = 500, effort = 'low' }) {
  const client = getClient();
  const { system, messages: rest } = splitSystemAndMessages(messages);
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: rest,
      output_config: { effort },
    });
    const textBlock = response.content.find((b) => b.type === 'text');
    return textBlock ? textBlock.text.trim() : '';
  } catch (e) {
    throw new Error(`model_error ${e && e.message}`);
  }
}

// Structured JSON output via Claude's native structured outputs (Zod schema),
// used where the caller needs a guaranteed-shape response (e.g. opportunities).
export async function callModelJSON({ messages, temperature = 0.4, maxTokens = 700, effort = 'medium', schema }) {
  const client = getClient();
  const { system, messages: rest } = splitSystemAndMessages(messages);
  let response;
  try {
    response = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: rest,
      output_config: { effort },
      output_format: betaZodOutputFormat(schema),
    });
  } catch (e) {
    throw new Error(`model_error ${e && e.message}`);
  }
  if (!response.parsed_output) throw new Error('model_error empty_or_unparsable');
  return response.parsed_output;
}

export function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}
