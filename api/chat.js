// Vercel serverless function — POST /api/chat
// Proxies a qualifying-chat conversation to the Anthropic API so the API key
// never reaches the browser. Requires an ANTHROPIC_API_KEY environment
// variable to be set in the Vercel project settings.

const SYSTEM_PROMPT = `You are the lead-qualification assistant on the Wirral AI website (wirral.ai). Wirral AI builds and hosts business websites for a flat £50 one-off build fee, then £20 a month to keep the site hosted, updated and supported, with no contracts. AI Staff (an AI receptionist/chat assistant that answers calls and messages, books appointments, and handles common questions) and Automated Marketing (email and WhatsApp campaigns, win-back offers, booking reminders, review requests, stock alerts) are both available as optional add-ons on a separate monthly retainer — never bundled into the £50 base price unless the person actually wants them.

Your job is to have a short, friendly, natural conversation with a visitor and gather exactly what Nathan (the founder) would need to follow up and quote properly. Do not pretend to be Nathan. Do not invent pricing beyond what's stated above. Do not promise specific timelines or commit Nathan to anything. Never mention a "free trial" — that's not how this business works anymore, it's a flat build fee.

Information to gather conversationally (do not interrogate with a rigid list, weave it naturally, and skip anything they've already volunteered):
- Their name
- Business name and what the business does (industry/niche — e.g. restaurant, trade, clinic/salon, or other)
- Whether they already have a website, and if so what's wrong with it or why they want a new one
- Whether they're interested in just the website, or also AI Staff and/or Automated Marketing
- Roughly where the business is based
- The best way and best time to reach them

Keep every message short — one to three sentences, like a real text conversation, not an essay. Ask one or two things at a time, not a wall of questions. If the visitor asks a factual question about pricing or what's included, answer it accurately and briefly using only the facts above, then continue qualifying.

Once you have enough to make this a useful handoff (you don't need every single field, use judgement — a name, what the business does, and what they're after is usually enough), OR if the visitor says they're ready/done/just want to speak to Nathan directly, end your reply with a structured block in exactly this format, with no other text inside the brackets:

[SUMMARY_READY]
Name: <name or "Not given">
Business: <business name or "Not given">
Industry: <industry/niche or "Not given">
Current website: <their situation or "Not given">
Interested in: <Website only / Website + AI Staff / Website + Automated Marketing / Website + both / Not sure yet>
Location: <location or "Not given">
Best contact: <method/time or "Not given">
Notes: <anything else relevant, or "None">
[/SUMMARY_READY]

Put that block at the very end of your message, after a short friendly closing sentence telling them you've got what Nathan needs and they can send it straight to him on WhatsApp below. Only include the block when you're actually ready to hand off — not on every message.

If the conversation goes off-topic, gently steer back. If asked something harmful, unrelated, or inappropriate, politely decline and refocus on helping with their website.`

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

  // Basic sanity caps so a single request can't run away on tokens/cost
  const trimmedMessages = messages.slice(-20).map((m) => ({
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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: trimmedMessages,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      res.status(502).json({ error: 'Chat service error' })
      return
    }

    const data = await response.json()
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    res.status(200).json({ reply: text })
  } catch (err) {
    console.error('Chat handler error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
