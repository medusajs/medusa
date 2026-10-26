import { CloudAnnouncement, CloudPluginOptions } from "../types"

export const DEFAULT_CLOUD_API_URL = "https://api.prod.medusajs.cloud"
export const ANNOUNCEMENTS_LIMIT = 10
export const ANNOUNCEMENTS_CACHE_TTL_MS = 10 * 60 * 1000
const REQUEST_TIMEOUT_MS = 5000

type RawAnnouncement = {
  id: string
  title: string
  subtitle?: string
  image_url?: string
  type?: CloudAnnouncement["type"]
  link_url?: string
  published_at?: string
}

let cache: {
  key: string
  expiresAt: number
  announcements: CloudAnnouncement[]
} | null = null

export const clearAnnouncementsCache = () => {
  cache = null
}

const isHttpUrl = (value?: string | null): value is string => {
  if (!value) {
    return false
  }

  try {
    const { protocol } = new URL(value)
    return protocol === "https:" || protocol === "http:"
  } catch {
    return false
  }
}

const toAnnouncement = (raw: RawAnnouncement): CloudAnnouncement => ({
  id: raw.id,
  title: raw.title,
  subtitle: raw.subtitle ?? null,
  image_url: isHttpUrl(raw.image_url) ? raw.image_url : null,
  type: raw.type ?? "feature",
  link_url: isHttpUrl(raw.link_url) ? raw.link_url : null,
  published_at: raw.published_at ?? null,
})

/**
 * Fetches the latest published announcements from the Medusa Cloud API.
 * Results are cached in memory, so admin page loads don't each hit the Cloud API.
 */
export const fetchAnnouncements = async (
  options: CloudPluginOptions = {}
): Promise<CloudAnnouncement[]> => {
  const baseUrl = (options.apiUrl || DEFAULT_CLOUD_API_URL).replace(/\/+$/, "")
  const url = new URL(`${baseUrl}/v1/announcements`)
  url.searchParams.set("limit", String(ANNOUNCEMENTS_LIMIT))
  url.searchParams.set("offset", "0")
  url.searchParams.set("order", "-published_at")

  const cacheKey = `${url.toString()}|${options.organizationId ?? ""}`
  if (cache && cache.key === cacheKey && cache.expiresAt > Date.now()) {
    return cache.announcements
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      ...(options.organizationId
        ? { "x-medusa-organization": options.organizationId }
        : {}),
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(
      `Medusa Cloud announcements request failed with status ${response.status}`
    )
  }

  const data = (await response.json()) as { announcements?: RawAnnouncement[] }
  const announcements = (data.announcements ?? []).map(toAnnouncement)

  cache = {
    key: cacheKey,
    expiresAt: Date.now() + ANNOUNCEMENTS_CACHE_TTL_MS,
    announcements,
  }

  return announcements
}
