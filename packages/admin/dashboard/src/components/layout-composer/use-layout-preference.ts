import { useCallback, useMemo } from "react"
import type { LayoutPreference } from "./types"
import {
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
  /** The current user's personal configuration, seeded from the default when unset. */
  personalPreference: LayoutPreference
  /** The zone's system default configuration. */
  defaultPreference: LayoutPreference
  /** The persisted scope the user is actively viewing for this zone. */
  activeScope: LayoutScope
  setPreference: (next: LayoutPreference, options?: SetPreferenceOptions) => void
}

function toPreference(
  configuration?: { widgets?: LayoutPreference["widgets"] } | null
): LayoutPreference | null {
  const widgets = configuration?.widgets
  return widgets ? { widgets } : null
}

export function useLayoutPreference(zone: string): UseLayoutPreferenceReturn {
  const { personal_configuration, default_configuration, active_scope } =
    useLayoutConfiguration(zone)

  const { mutate: setLayoutConfiguration } = useSetLayoutConfiguration(zone)

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

  const setPreference = useCallback(
    (next: LayoutPreference, options?: SetPreferenceOptions) => {
      setLayoutConfiguration({
        is_default: options?.asDefault ?? false,
        configuration: { widgets: next.widgets },
      })
    },
    [setLayoutConfiguration]
  )

  return {
    personalPreference,
    defaultPreference,
    activeScope,
    setPreference,
  }
}
