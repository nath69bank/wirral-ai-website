const SUMMARY_RE = /\[SUMMARY_READY\]([\s\S]*?)\[\/SUMMARY_READY\]/

export interface ParsedReply {
  displayText: string
  summaryForWhatsApp: string | null
  showBooking: boolean
}

export function parseAssistantReply(
  raw: string,
  apiMeta?: { showBooking?: boolean; summaryRaw?: string | null }
): ParsedReply {
  // If the API already parsed these server-side, use those values
  const showBooking = apiMeta?.showBooking ?? raw.includes('[SHOW_BOOKING]')
  const summaryRaw = apiMeta?.summaryRaw ?? null

  const displayText = raw
    .replace('[SHOW_BOOKING]', '')
    .replace(SUMMARY_RE, '')
    .trim()

  const summaryForWhatsApp = summaryRaw
    ? `New Wirral AI enquiry from the website chatbot:\n\n${summaryRaw}`
    : null

  return { displayText, summaryForWhatsApp, showBooking }
}
