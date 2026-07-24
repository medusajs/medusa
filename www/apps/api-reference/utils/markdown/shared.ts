import type { OpenAPI } from "types"

/**
 * Shared context threaded through the OAS -> Markdown converters, mirroring the
 * `area`/base-URL data the React renderers read from providers/env.
 */
export type MarkdownContext = {
  area: OpenAPI.Area
  baseUrl: string
  basePath: string
}

/** Collapse whitespace/newlines to a single line (compact type-list style). */
export const oneLine = (text: string): string =>
  text.replace(/\s*\n+\s*/g, " ").trim()

/** Capitalize the first character (mirrors docs-ui `capitalize`). */
export const capitalize = (text: string): string => {
  return text.length ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

/**
 * Absolutize an in-content link. Internal paths (starting with `/`) are
 * prefixed with the base URL + base path (matching how the site's `Link`
 * prepends `/api`); everything else is returned unchanged.
 */
export const absolutizeLink = (url: string, ctx: MarkdownContext): string => {
  if (url.startsWith("/")) {
    return `${ctx.baseUrl}${ctx.basePath}${url}`
  }
  return url
}
