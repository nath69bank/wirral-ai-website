const SUMMARY_RE = /\[SUMMARY_READY\]([\s\S]*?)\[\/SUMMARY_READY\]/

export interface ParsedReply {
  /** The conversational text, with the summary block removed */
  displayText: string
  /** Present only once the assistant has signalled it's ready to hand off */
  summaryForWhatsApp: string | null
}

export function parseAssistantReply(raw: string): ParsedReply {
  const match = raw.match(SUMMARY_RE)
  if (!match) {
    return { displayText: raw.trim(), summaryForWhatsApp: null }
  }

  const displayText = raw.replace(SUMMARY_RE, '').trim()
  const fields = match[1].trim()

  const summaryForWhatsApp = `New website enquiry from the site chatbot:\n\n${fields}`

  return { displayText, summaryForWhatsApp }
}
