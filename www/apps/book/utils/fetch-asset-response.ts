import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * Fetches a static asset through the worker's ASSETS binding and returns the
 * raw response so callers can stream the body instead of buffering it. Returns
 * null outside Cloudflare (next dev / build) or when the asset doesn't exist.
 */
export async function fetchAssetResponse(
  url: string
): Promise<Response | null> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const res = await env.ASSETS?.fetch(url)
    return res?.ok ? res : null
  } catch {
    return null
  }
}
