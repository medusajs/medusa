const LAST_SEEN_KEY = "medusa_cloud_announcements_last_seen_at"
const SHOWN_KEY = "medusa_cloud_shown_announcement_ids"

const read = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable (e.g. blocked site data); the UI still works without it.
  }
}

export const getLastSeenAt = () => read(LAST_SEEN_KEY)
export const setLastSeenAt = (value: string) => write(LAST_SEEN_KEY, value)

export const getShownAnnouncementIds = (): string[] => {
  try {
    const value = JSON.parse(read(SHOWN_KEY) ?? "[]")
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}
export const addShownAnnouncementId = (id: string) =>
  write(SHOWN_KEY, JSON.stringify([...getShownAnnouncementIds(), id]))
