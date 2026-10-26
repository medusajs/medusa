import {
  CloudAnnouncement,
  CloudAnnouncementType,
  CloudHint,
  CloudPluginOptions,
} from "../types"

export const DEFAULT_CLOUD_API_URL = "https://api.prod.medusajs.cloud"
export const ANNOUNCEMENTS_LIMIT = 10
export const HINTS_LIMIT = 50
export const ANNOUNCEMENTS_CACHE_TTL_MS = 10 * 60 * 1000
const REQUEST_TIMEOUT_MS = 5000

const ANNOUNCEMENT_TYPES: CloudAnnouncementType[] = [
  "info",
  "feature",
  "warning",
  "incident",
  "release",
]

type RawAnnouncement = {
  id: string
  title: string
  subtitle?: string
  image_url?: string
  type?: CloudAnnouncementType | "hint"
  link_url?: string
  admin_path?: string
  published_at?: string
}

const cache = new Map<
  string,
  { expiresAt: number; announcements: RawAnnouncement[] }
>()

export const clearAnnouncementsCache = () => {
  cache.clear()
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
  type: raw.type && raw.type !== "hint" ? raw.type : "feature",
  link_url: isHttpUrl(raw.link_url) ? raw.link_url : null,
  published_at: raw.published_at ?? null,
})

/**
 * Fetches published announcements of the given types from the Medusa Cloud API.
 * Results are cached in memory, so admin page loads don't each hit the Cloud API.
 */
const fetchRawAnnouncements = async (
  options: CloudPluginOptions,
  types: string[],
  limit: number
): Promise<RawAnnouncement[]> => {
  const baseUrl = (options.apiUrl || DEFAULT_CLOUD_API_URL).replace(/\/+$/, "")
  const url = new URL(`${baseUrl}/v1/announcements`)
  url.searchParams.set("limit", String(limit))
  url.searchParams.set("offset", "0")
  url.searchParams.set("order", "-published_at")
  types.forEach((type, index) => url.searchParams.set(`type[${index}]`, type))

  const cacheKey = `${url.toString()}|${options.organizationId ?? ""}`
  const cached = cache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.announcements
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
  const announcements = data.announcements ?? []

  cache.set(cacheKey, {
    expiresAt: Date.now() + ANNOUNCEMENTS_CACHE_TTL_MS,
    announcements,
  })

  return announcements
}

export const fetchAnnouncements = async (
  options: CloudPluginOptions = {}
): Promise<CloudAnnouncement[]> => {
  const announcements = await fetchRawAnnouncements(
    options,
    ANNOUNCEMENT_TYPES,
    ANNOUNCEMENTS_LIMIT
  )

  return announcements.map(toAnnouncement)
}

export const fetchHints = async (
  options: CloudPluginOptions = {}
): Promise<CloudHint[]> => {
  const announcements = await fetchRawAnnouncements(
    options,
    ["hint"],
    HINTS_LIMIT
  )

  return announcements
    .filter((raw) => raw.type === "hint" && raw.admin_path?.startsWith("/"))
    .map((raw) => ({
      id: raw.id,
      title: raw.title,
      description: raw.subtitle ?? null,
      link_url: isHttpUrl(raw.link_url) ? raw.link_url : null,
      admin_path: raw.admin_path!,
    }))
}
