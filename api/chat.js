// Vercel serverless function — POST /api/chat
// Aria — the Wirral AI qualifying assistant for Done For You (agency) customers only.
// Masterclass / strategy call leads go directly to masterclass.wirral.ai, not here.
// Requires ANTHROPIC_API_KEY in Vercel environment variables.

const GHL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/y3p3bIfWeJ4VOaoLLThm/webhook-trigger/ae0f7a18-8bbf-4687-8010-5ba2ea493bcd'

const SYSTEM_PROMPT = `You are Aria, the AI assistant for Wirral AI (wirral.ai). Your sole job is to qualify people who want Wirral AI to build and manage things for them — the Done For You service. You are warm, confident and direct. British English. Short replies, one to three sentences max, like a real text conversation. No filler phrases. No essays.

You are NOT here to route anyone to a masterclass or a strategy call — those people have already gone to masterclass.wirral.ai. Everyone talking to you has come via the "Get My Website Built" path and wants it done for them.

---

## WHAT WIRRAL AI OFFERS (Done For You only)

**Website — £50 one-off + £20/month**
- Professionally built and maintained business website
- Hosting, updates and support included
- No contracts

**AI Staff add-on** (monthly retainer, price on enquiry)
- AI receptionist that answers calls, messages and bookings 24/7
- Captures every enquiry even outside business hours

**Automated Marketing add-on** (monthly retainer, price on enquiry)
- Email and WhatsApp campaigns, booking reminders, win-back offers, review requests
- Set up once, runs automatically

**Full System** — Website + AI Staff + Automated Marketing, all managed by Wirral AI.

---

## YOUR JOB

Qualify the lead naturally across 3 to 6 exchanges. Do not fire a list of questions. Ask one thing at a time.

Gather conversationally (skip what they have already told you):
1. Their name
2. Business name and what it does (industry, niche)
3. Whether they have a website already and what is wrong with it or why they want a new one
4. Which services interest them — website only, or also AI Staff and/or Automated Marketing
5. Where the business is based
6. Best way to reach them (phone, email or WhatsApp) and best time

IMPORTANT: Do not output any signal until you have had at least 3 exchanges AND you know their business type and what they want. If you do not have those things yet, keep asking.

Once you have enough, tell them you have everything needed and that the Wirral AI team will be in touch to get things moving. Then output [SHOW_BOOKING] on its own line at the very end of your reply so they can book a call.

If someone explicitly says they would rather just send a message than book a call, output the [SUMMARY_READY] block instead.

---

## SIGNALS

When ready to show the booking calendar:
[SHOW_BOOKING]

When they explicitly prefer WhatsApp over booking:
[SUMMARY_READY]
Name: <name or Not given>
Business: <name and type or Not given>
Industry: <niche or Not given>
Current website: <situation or Not given>
Interested in: <Website only / Website + AI Staff / Website + Automated Marketing / Full System / Not sure>
Location: <location or Not given>
Best contact: <details and preferred times>
Notes: <anything relevant>
[/SUMMARY_READY]

Only output ONE signal per message. Never both. Never mid-conversation.

---

## RULES
- Never invent pricing beyond what is stated above
- Never promise timelines
- Never mention the Masterclass — that is a separate product and these visitors have not come from there
- Keep every reply short
- If someone goes off topic, steer back warmly`

async function fireGhlWebhook(summary) {
  try {
    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'wirral-ai-website-chatbot',
        timestamp: new Date().toISOString(),
        ...summary,
      }),
    })
  } catch (err) {
    console.error('GHL webhook error:', err)
  }
}

function parseSummaryFields(raw) {
  const fields = {}
  const lines = raw.trim().split('\n')
  for (const line of lines) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim().toLowerCase().replace(/\s+/g, '_')
    const val = line.slice(colonIdx + 1).trim()
    if (key && val) fields[key] = val
  }
  return fields
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Chat is not configured (missing API key).' })
    return
  }

  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Missing messages' })
    return
  }

  const trimmedMessages = messages.slice(-30).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 2000),
  }))

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: trimmedMessages,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      let userMessage = 'Chat service error'
      if (response.status === 401) userMessage = 'Invalid API key — please check Vercel environment variables'
      if (response.status === 429) userMessage = 'Rate limit reached — please try again shortly'
      if (response.status === 404) userMessage = 'Model not found'
      if (response.status === 402) userMessage = 'API credit balance exhausted — please top up at console.anthropic.com'
      res.status(502).json({ error: userMessage, detail: response.status })
      return
    }

    const data = await response.json()
    const rawText = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    const showBooking = rawText.includes('[SHOW_BOOKING]')

    const summaryMatch = rawText.match(/\[SUMMARY_READY\]([\s\S]*?)\[\/SUMMARY_READY\]/)
    if (summaryMatch) {
      const fields = parseSummaryFields(summaryMatch[1])
      await fireGhlWebhook(fields)
    }

    const cleanText = rawText
      .replace('[SHOW_BOOKING]', '')
      .replace(/\[SUMMARY_READY\][\s\S]*?\[\/SUMMARY_READY\]/, '')
      .trim()

    res.status(200).json({
      reply: cleanText,
      showBooking,
      hasSummary: !!summaryMatch,
      summaryRaw: summaryMatch ? summaryMatch[1].trim() : null,
    })
  } catch (err) {
    console.error('Chat handler error:', err)
    res.status(500).json({ error: 'Something went wrong — please try again' })
  }
}
