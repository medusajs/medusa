const LAST_SEEN_KEY = "medusa_cloud_announcements_last_seen_at"
const DISMISSED_KEY = "medusa_cloud_dismissed_announcement_ids"
const SINCE_KEY = "medusa_cloud_announcements_since"

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

/**
 * Returns the date the admin was first opened in this browser with the plugin,
 * storing it the first time. Announcements published before it aren't new to
 * the user.
 */
export const getAnnouncementsSince = () => {
  const stored = read(SINCE_KEY)
  if (stored) {
    return stored
  }

  const now = new Date().toISOString()
  write(SINCE_KEY, now)

  return now
}

export const getLastSeenAt = () =>
  read(LAST_SEEN_KEY) ?? getAnnouncementsSince()
export const setLastSeenAt = (value: string) => write(LAST_SEEN_KEY, value)

export const getDismissedAnnouncementIds = (): string[] => {
  try {
    const value = JSON.parse(read(DISMISSED_KEY) ?? "[]")
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}
export const addDismissedAnnouncementId = (id: string) =>
  write(DISMISSED_KEY, JSON.stringify([...getDismissedAnnouncementIds(), id]))
