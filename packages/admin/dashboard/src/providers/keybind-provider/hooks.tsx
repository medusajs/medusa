import { default as debounceFn } from "lodash.debounce"
import { useCallback, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { useLogout } from "../../hooks/api/auth"
import { queryClient } from "../../lib/query-client"
import {
  getSearchEntityShortcuts,
  resolveSearchEntityShortcutLabel,
} from "../../lib/search/search-entities"
import { KeybindContext } from "./keybind-context"
import { Shortcut } from "./types"
import { findShortcut } from "./utils"

export const useKeybind = () => {
  const context = useContext(KeybindContext)

  if (!context) {
    throw new Error("useKeybind must be used within a KeybindProvider")
  }

  return context
}

export const useRegisterShortcut = () => {}

export const useShortcuts = ({
  shortcuts = [],
  debounce,
}: {
  shortcuts?: Shortcut[]
  debounce: number
}) => {
  const [keys, setKeys] = useState<string[]>([])
  const navigate = useNavigate()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const removeKeys = useCallback(
    debounceFn(() => setKeys([]), debounce),
    []
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const invokeShortcut = useCallback(
    debounceFn((shortcut: Shortcut | null) => {
      if (shortcut && shortcut.callback) {
        shortcut.callback()
        setKeys([])

        return
      }

      if (shortcut && shortcut.to) {
        navigate(shortcut.to)
        setKeys([])

        return
      }
    }, debounce / 2),
    []
  )

  useEffect(() => {
    if (keys.length > 0 && shortcuts.length > 0) {
      const shortcut = findShortcut(shortcuts, keys)
      invokeShortcut(shortcut)
    }

    return () => invokeShortcut.cancel()
  }, [keys, shortcuts, invokeShortcut])

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement

      /**
       * Ignore key events from input, textarea and contenteditable elements
       */
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        removeKeys()
        return
      }

      setKeys((oldKeys) => [...oldKeys, event.key])
      removeKeys()
    }

    window.addEventListener("keydown", listener)

    return () => {
      window.removeEventListener("keydown", listener)
    }
  }, [removeKeys])
}

export const useGlobalShortcuts = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { mutateAsync } = useLogout()

  const handleLogout = async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        queryClient.clear()
        navigate("/login")
      },
    })
  }

  const globalShortcuts: Shortcut[] = [
    // "Jump to" entries come from the search entity registry, so apps and
    // plugins customize them through their `search-entities.tsx` definitions.
    ...getSearchEntityShortcuts().map(
      ({ entity, shortcut }): Shortcut => ({
        keys: shortcut.keys,
        label: resolveSearchEntityShortcutLabel(entity, t),
        type: shortcut.type ?? "pageShortcut",
        to: shortcut.to,
      })
    ),
    // The admin shell's own destinations, which belong to no entity.
    {
      keys: {
        Mac: ["G", ","],
      },
      label: t("app.keyboardShortcuts.settings.goToSettings"),
      type: "settingShortcut",
      to: "/settings",
    },
    {
      keys: {
        Mac: ["G", ",", "S"],
      },
      label: t("app.keyboardShortcuts.settings.goToStore"),
      type: "settingShortcut",
      to: "/settings/store",
    },
    {
      keys: {
        Mac: ["G", ",", "W"],
      },
      label: t("app.keyboardShortcuts.settings.goToWorkflows"),
      type: "settingShortcut",
      to: "/settings/workflows",
    },
    {
      keys: {
        Mac: ["G", ",", "M"],
      },
      label: t("app.keyboardShortcuts.settings.goToProfile"),
      type: "settingShortcut",
      to: "/settings/profile",
    },
    // Commands that need app hooks stay built in.
    {
      keys: {
        Mac: ["B", "Y", "E"],
      },
      label: t("actions.logout"),
      type: "commandShortcut",
      callback: () => handleLogout(),
    },
  ]

  return globalShortcuts
}
