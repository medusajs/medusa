import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * Reads a spec file through the R2 bucket binding, avoiding the HTTP round
 * trip that fetching the public bucket URL requires. The URL's pathname maps
 * directly to the object key because the public bucket URL serves the bucket
 * root. Returns null outside Cloudflare (next dev / build), when the binding
 * isn't configured, or when `url` isn't an R2 URL, so callers can fall back
 * to fetching or reading from the filesystem.
 */
export async function readSpecFromBinding(url: string): Promise<string | null> {
  const r2Base = process.env.SPECS_R2_BASE_URL
  if (!r2Base || !url.startsWith(r2Base)) {
    return null
  }

  try {
    // async mode so this also works in statically rendered contexts
    const { env } = await getCloudflareContext({ async: true })
    const key = new URL(url).pathname.replace(/^\//, "")
    const object = await env.SPECS_R2_BUCKET?.get(key)
    return object ? await object.text() : null
  } catch {
    return null
  }
}
