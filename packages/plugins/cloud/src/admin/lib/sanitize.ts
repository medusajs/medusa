import DOMPurify from "dompurify"

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.hasAttribute("href")) {
    node.setAttribute("target", "_blank")
    node.setAttribute("rel", "noopener noreferrer")
  }
})

/**
 * Sanitizes announcement HTML authored in the Medusa Cloud admin, so it's safe
 * to render. Links open in a new tab.
 */
export const sanitizeHtml = (html: string) =>
  DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
