/**
 * Wirral AI uses WhatsApp as its final handoff channel. Visitors no longer
 * jump straight to WhatsApp from CTAs — they go through the AI chat widget
 * first, which qualifies them and builds a proper summary, then this helper
 * is used once to hand that summary off to WhatsApp.
 */
const WHATSAPP_NUMBER = '447368349702' // +44 7368 349702

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
