import { useCallback, useEffect, useState } from "react"
import type { LayoutPreference, WidgetPreference } from "@medusajs/admin-shared"

function storageKey(zone: string) {
  return `medusa:layout:${zone}`
}

function readPreference(zone: string): LayoutPreference {
  try {
    const raw = localStorage.getItem(storageKey(zone))
    if (raw) {
      return JSON.parse(raw) as LayoutPreference
    }
  } catch {
    // ignore parse/storage errors
  }
  return { widgets: {} }
}

function writePreference(zone: string, pref: LayoutPreference) {
  try {
    localStorage.setItem(storageKey(zone), JSON.stringify(pref))
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

export type UseLayoutPreferenceReturn = {
  preference: LayoutPreference
  setWidgetPreference: (widgetId: string, update: WidgetPreference) => void
  setPreference: (next: LayoutPreference) => void
  resetPreference: () => void
}

export function useLayoutPreference(zone: string): UseLayoutPreferenceReturn {
  const [preference, setPreference] = useState<LayoutPreference>(() =>
    readPreference(zone)
  )

  useEffect(() => {
    setPreference(readPreference(zone))
  }, [zone])

  const setWidgetPreference = useCallback(
    (widgetId: string, update: WidgetPreference) => {
      setPreference((prev) => {
        const next: LayoutPreference = {
          ...prev,
          widgets: {
            ...prev.widgets,
            [widgetId]: { ...prev.widgets[widgetId], ...update },
          },
        }
        writePreference(zone, next)
        return next
      })
    },
    [zone]
  )

  const commitPreference = useCallback(
    (next: LayoutPreference) => {
      writePreference(zone, next)
      setPreference(next)
    },
    [zone]
  )

  const resetPreference = useCallback(() => {
    commitPreference({ widgets: {} })
  }, [commitPreference])

  return {
    preference,
    setWidgetPreference,
    setPreference: commitPreference,
    resetPreference,
  }
}
