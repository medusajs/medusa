/**
 * Shared bits of the public, cross-origin JSON endpoints under `app/api`.
 * These are read-only and unauthenticated, so any origin may call them.
 */
export const PUBLIC_API_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export const PUBLIC_API_CACHE_CONTROL = "public, max-age=3600, must-revalidate"
