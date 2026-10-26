const LAST_SEEN_KEY = "medusa_cloud_announcements_last_seen_at"
const LAST_TOASTED_KEY = "medusa_cloud_announcements_last_toasted_id"
const LAST_TOAST_AT_KEY = "medusa_cloud_last_toast_at"
const SHOWN_HINTS_KEY = "medusa_cloud_shown_hint_ids"

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

export const getLastToastAt = () => {
  const value = Number(read(LAST_TOAST_AT_KEY))
  return Number.isFinite(value) && value > 0 ? value : null
}
export const setLastToastAt = (value: number) =>
  write(LAST_TOAST_AT_KEY, String(value))

export const getShownHintIds = (): string[] => {
  try {
    const value = JSON.parse(read(SHOWN_HINTS_KEY) ?? "[]")
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}
export const addShownHintId = (id: string) =>
  write(SHOWN_HINTS_KEY, JSON.stringify([...getShownHintIds(), id]))
