import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * Fetches a static asset through the worker's ASSETS binding, avoiding the
 * HTTP round trip (and extra worker invocation) that fetching the public URL
 * requires. Returns null outside Cloudflare (next dev / build) or when the
 * asset doesn't exist, so callers can fall back to fetching or reading from
 * the filesystem.
 */
export async function fetchFromAssetsBinding(
  url: string
): Promise<string | null> {
  try {
    // async mode so this also works in statically rendered contexts
    const { env } = await getCloudflareContext({ async: true })
    const res = await env.ASSETS?.fetch(url)
    return res?.ok ? await res.text() : null
  } catch {
    return null
  }
}
