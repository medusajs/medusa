import { useCallback, useMemo } from "react"
import type { LayoutPreference, WidgetPreference } from "./types"
import {
  useDeleteLayoutConfiguration,
  useLayoutConfiguration,
  useSetLayoutConfiguration,
} from "../../hooks/api/layouts"

const EMPTY_PREFERENCE: LayoutPreference = { widgets: {} }

export type LayoutScope = "personal" | "default"

export type SetPreferenceOptions = {
  /**
   * Persist as the zone's system default (applies to all users) instead of the
   * current user's personal configuration.
   */
  asDefault?: boolean
}

export type UseLayoutPreferenceReturn = {
  /** The configuration the user is actively viewing for this zone. */
  preference: LayoutPreference
  /** The current user's personal configuration, seeded from the default when unset. */
  personalPreference: LayoutPreference
  /** The zone's system default configuration. */
  defaultPreference: LayoutPreference
  /** Whether the current user has saved a personal configuration. */
  hasPersonal: boolean
  /** The persisted scope the user is actively viewing for this zone. */
  activeScope: LayoutScope
  isPending: boolean
  setWidgetPreference: (widgetId: string, update: WidgetPreference) => void
  setPreference: (
    next: LayoutPreference,
    options?: SetPreferenceOptions
  ) => void
  resetPreference: () => void
}

function toPreference(
  configuration?: { widgets?: LayoutPreference["widgets"] } | null
): LayoutPreference | null {
  const widgets = configuration?.widgets
  return widgets ? { widgets } : null
}

export function useLayoutPreference(zone: string): UseLayoutPreferenceReturn {
  const {
    personal_configuration,
    default_configuration,
    active_scope,
    isPending,
  } = useLayoutConfiguration(zone)

  const { mutate: setLayoutConfiguration } = useSetLayoutConfiguration(zone)
  const { mutate: deleteLayoutConfiguration } =
    useDeleteLayoutConfiguration(zone)

  const hasPersonal = !!personal_configuration

  const defaultPreference = useMemo(
    () =>
      toPreference(default_configuration?.configuration) ?? EMPTY_PREFERENCE,
    [default_configuration]
  )

  const personalPreference = useMemo(
    () =>
      toPreference(personal_configuration?.configuration) ?? defaultPreference,
    [personal_configuration, defaultPreference]
  )

  const activeScope: LayoutScope = active_scope ?? "personal"

  const preference =
    activeScope === "default" ? defaultPreference : personalPreference

  const setPreference = useCallback(
    (next: LayoutPreference, options?: SetPreferenceOptions) => {
      setLayoutConfiguration({
        is_default: options?.asDefault ?? false,
        configuration: { widgets: next.widgets },
      })
    },
    [setLayoutConfiguration]
  )

  const setWidgetPreference = useCallback(
    (widgetId: string, update: WidgetPreference) => {
      setPreference({
        widgets: {
          ...preference.widgets,
          [widgetId]: { ...preference.widgets[widgetId], ...update },
        },
      })
    },
    [preference, setPreference]
  )

  const resetPreference = useCallback(() => {
    deleteLayoutConfiguration()
  }, [deleteLayoutConfiguration])

  return {
    preference,
    personalPreference,
    defaultPreference,
    hasPersonal,
    activeScope,
    isPending,
    setWidgetPreference,
    setPreference,
    resetPreference,
  }
}
