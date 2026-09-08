import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * Reads a reference file through the R2 bucket binding, avoiding the HTTP
 * round trip that fetching the public bucket URL requires. Returns null
 * outside Cloudflare (next dev / build) or when the binding isn't
 * configured, so callers can fall back to fetching.
 */
export async function loadReferenceFromBinding(
  key: string
): Promise<string | null> {
  try {
    // async mode so this also works in statically rendered contexts
    const { env } = await getCloudflareContext({ async: true })
    const object = await env.REFERENCES_R2_BUCKET?.get(key)
    return object ? await object.text() : null
  } catch {
    return null
  }
}
