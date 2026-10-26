const LAST_SEEN_KEY = "medusa_cloud_announcements_last_seen_at"
const LAST_TOASTED_KEY = "medusa_cloud_announcements_last_toasted_id"

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

export const getLastToastedId = () => read(LAST_TOASTED_KEY)
export const setLastToastedId = (id: string) => write(LAST_TOASTED_KEY, id)
