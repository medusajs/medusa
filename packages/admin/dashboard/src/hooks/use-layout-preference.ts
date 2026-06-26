import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import { MutateOptions } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { LayoutPreference } from "../components/layout-composer/types"
import {
  useLayoutConfiguration,
  useSetLayoutConfiguration,
} from "./api/layouts"

const EMPTY_PREFERENCE: LayoutPreference = { widgets: {} }

export type LayoutScope = "personal" | "default"

export type SetPreferenceOptions = {
  /**
   * Persist as the zone's system default (applies to all users) instead of the
   * current user's personal configuration.
   */
  asDefault?: boolean
}

/**
 * Per-call react-query mutate options for `setPreference`, used to run
 * caller-specific side effects (e.g. exiting edit mode) once the save settles.
 * Generic toasts are already handled inside the hook.
 */
export type SetPreferenceMutateOptions = MutateOptions<
  HttpTypes.AdminLayoutConfigurationResponse,
  FetchError,
  HttpTypes.AdminSetLayoutConfiguration
>

export type UseLayoutPreferenceReturn = {
  /** The current user's personal configuration, seeded from the default when unset. */
  personalPreference: LayoutPreference
  /** The zone's system default configuration. */
  defaultPreference: LayoutPreference
  /** The persisted scope the user is actively viewing for this zone. */
  activeScope: LayoutScope
  setPreference: (
    next: LayoutPreference,
    options?: SetPreferenceOptions,
    mutateOptions?: SetPreferenceMutateOptions
  ) => void
  isSaving: boolean
}

function toPreference(
  configuration?: { widgets?: LayoutPreference["widgets"] } | null
): LayoutPreference | null {
  const widgets = configuration?.widgets
  return widgets ? { widgets } : null
}

export function useLayoutPreference(zone: string): UseLayoutPreferenceReturn {
  const { t } = useTranslation()

  const { personal_configuration, default_configuration, active_scope } =
    useLayoutConfiguration(zone)

  const { mutate: setLayoutConfiguration, isPending: isSaving } =
    useSetLayoutConfiguration(zone, {
      onSuccess: () => toast.success(t("layout.saveSuccess")),
      onError: (error) => toast.error(error.message),
    })

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
    (
      next: LayoutPreference,
      options?: SetPreferenceOptions,
      mutateOptions?: SetPreferenceMutateOptions
    ) => {
      setLayoutConfiguration(
        {
          is_default: options?.asDefault ?? false,
          configuration: { widgets: next.widgets },
        },
        mutateOptions
      )
    },
    [setLayoutConfiguration]
  )

  return {
    personalPreference,
    defaultPreference,
    activeScope,
    setPreference,
    isSaving,
  }
}
