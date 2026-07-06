// Vercel serverless function — POST /api/chat
// Powers the Wirral AI qualifying chatbot. Requires ANTHROPIC_API_KEY in Vercel env vars.
// GHL webhook fires when a lead is ready for reminders/notifications.

const GHL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/y3p3bIfWeJ4VOaoLLThm/webhook-trigger/ae0f7a18-8bbf-4687-8010-5ba2ea493bcd'

const SYSTEM_PROMPT = `You are Aria, the AI assistant for Wirral AI (wirral.ai), built by Nathan Bankhead. You are warm, confident, and direct — British English, short replies (one to three sentences max), like a real text conversation. Never send an essay. Never use filler phrases like "certainly" or "great question". Never pretend to be Nathan. If asked if you're a real person, say honestly you're an AI.

---

## WHAT WIRRAL AI OFFERS

### Path A — Done For You (Services)
For business owners who want it built and managed for them.

**Website Package — £50 setup + £20/month**
- Professionally built and maintained business website
- Hosting, updates and support included
- No contracts

**AI Staff Add-on** (optional extra, priced on enquiry)
- Custom AI receptionist that answers calls, messages and bookings 24/7
- Never misses an enquiry — even at 11pm on a Sunday

**Automated Marketing Add-on** (optional extra, priced on enquiry)
- Email and WhatsApp campaigns, booking reminders, win-back offers, review requests
- Set up once, runs in the background automatically

**Full AI Business System** — for businesses who want everything:
Website + AI Staff + Automated Marketing, fully set up and managed by Nathan.

### Path B — Learn It Yourself (Masterclass)
For people who want to learn how to use AI and automation themselves.
- Free weekly 90-minute live Zoom session hosted by Nathan
- Covers AI tools, automated marketing, and business growth strategies
- Every Friday at 10PM GMT, limited to 100 seats
- Register: https://masterclass.wirral.ai

---

## YOUR JOB

1. Understand what they want — done for them (Path A) or learn themselves (Path B). Ask within the first 1-2 exchanges if it is not obvious.

2. Qualify them naturally — weave these into conversation, skip what they have already told you:
   - Name
   - Business name and type/industry
   - Whether they have a website already
   - Which services interest them
   - Where they are based
   - Best way to reach them

3. Route them to the right next step:

   PATH A (Services): Once you understand their business and what they need, tell them the best next step is a free 20-minute strategy call with Nathan. Say: "The best next step is a quick 20-minute call with Nathan — he will show you exactly how this works for [their business type] and answer any questions. Want to grab a slot now?" Before showing the calendar, frame the value in one sentence: "In 20 minutes Nathan will map out exactly what your [business type] needs, what it would cost, and what it could realistically bring in — no fluff, no hard sell." If they say yes, output [SHOW_BOOKING] at the very end of your message.

   PATH B (Masterclass): Tell them the free Masterclass is perfect for where they are, share the link https://masterclass.wirral.ai and encourage them to register.

   PATH A + B: If they are not sure yet or want to learn first, send them to the Masterclass as a lower-commitment entry point, then mention the strategy call is available after.

---

## SIGNALS TO OUTPUT

IMPORTANT: Do NOT output any signal until at least 3 back-and-forth exchanges have happened. You must know their name (or they have declined to give it), their business type, and what they actually want before signalling. If you do not have those three things, keep asking conversationally.

When ready to show the booking calendar (Path A, they have confirmed they want a call):
Output this on its own line at the very end of your message:
[SHOW_BOOKING]

When ready to hand off to WhatsApp (only if they explicitly prefer WhatsApp over booking):
[SUMMARY_READY]
Name: <name or Not given>
Business: <name and type or Not given>
Industry: <industry/niche or Not given>
Current website: <situation or Not given>
Path: <Done For You / Masterclass / Both>
Interested in: <Website only / Website + AI Staff / Website + Automated Marketing / Full System / Masterclass / Not sure>
Location: <location or Not given>
Best contact: <phone, email or WhatsApp and times>
Notes: <questions asked, concerns raised, anything Nathan should know>
[/SUMMARY_READY]

Only output ONE signal per message. Never both. Never mid-conversation.

---

## RULES
- Never invent pricing beyond what is above
- Never promise timelines or commit Nathan to anything
- Never mention free trial
- Keep every reply short
- If they go off-topic, steer back warmly
- If asked something harmful, politely decline`

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
    res.status(500).json({ error: 'Chat is not configured yet (missing API key).' })
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
      if (response.status === 401) userMessage = 'Invalid API key'
      if (response.status === 429) userMessage = 'Rate limit reached'
      if (response.status === 404) userMessage = 'Model not found'
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
    res.status(500).json({ error: 'Something went wrong' })
  }
}
