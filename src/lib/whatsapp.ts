/**
 * Wirral AI uses WhatsApp as its single lead-capture channel — no forms, no email
 * gates. Every CTA on the site opens a pre-filled WhatsApp conversation so a real
 * person can qualify the lead immediately instead of it sitting in an inbox.
 */
const WHATSAPP_NUMBER = '447368349702' // +44 7368 349702

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi Wirral AI — I'd like to start my free trial and see how this could work for my business."
