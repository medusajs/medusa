import debounceFn from "lodash/debounce"
import { useCallback, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { useLogout } from "../../hooks/api/auth"
import { queryClient } from "../../lib/query-client"
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
    // Pages
    {
      keys: {
        Mac: ["G", "O"],
      },
      label: t("app.keyboardShortcuts.navigation.goToOrders"),
      type: "pageShortcut",
      to: "/orders",
    },
    {
      keys: {
        Mac: ["G", "P"],
      },
      label: t("app.keyboardShortcuts.navigation.goToProducts"),
      type: "pageShortcut",
      to: "/products",
    },
    {
      keys: {
        Mac: ["G", "C"],
      },
      label: t("app.keyboardShortcuts.navigation.goToCollections"),
      type: "pageShortcut",
      to: "/collections",
    },
    {
      keys: {
        Mac: ["G", "A"],
      },
      label: t("app.keyboardShortcuts.navigation.goToCategories"),
      type: "pageShortcut",
      to: "/categories",
    },
    {
      keys: {
        Mac: ["G", "U"],
      },
      label: t("app.keyboardShortcuts.navigation.goToCustomers"),
      type: "pageShortcut",
      to: "/customers",
    },
    {
      keys: {
        Mac: ["G", "G"],
      },
      label: t("app.keyboardShortcuts.navigation.goToCustomerGroups"),
      type: "pageShortcut",
      to: "/customer-groups",
    },
    {
      keys: {
        Mac: ["G", "I"],
      },
      label: t("app.keyboardShortcuts.navigation.goToInventory"),
      type: "pageShortcut",
      to: "/inventory",
    },
    {
      keys: {
        Mac: ["G", "R"],
      },
      label: t("app.keyboardShortcuts.navigation.goToReservations"),
      type: "pageShortcut",
      to: "/reservations",
    },
    {
      keys: {
        Mac: ["G", "L"],
      },
      label: t("app.keyboardShortcuts.navigation.goToPriceLists"),
      type: "pageShortcut",
      to: "/price-lists",
    },
    {
      keys: {
        Mac: ["G", "M"],
      },
      label: t("app.keyboardShortcuts.navigation.goToPromotions"),
      type: "pageShortcut",
      to: "/promotions",
    },
    {
      keys: {
        Mac: ["G", "K"],
      },
      label: t("app.keyboardShortcuts.navigation.goToCampaigns"),
      type: "pageShortcut",
      to: "/campaigns",
    },
    // Settings
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
        Mac: ["G", ",", "U"],
      },
      label: t("app.keyboardShortcuts.settings.goToUsers"),
      type: "settingShortcut",
      to: "/settings/users",
    },
    {
      keys: {
        Mac: ["G", ",", "R"],
      },
      label: t("app.keyboardShortcuts.settings.goToRegions"),
      type: "settingShortcut",
      to: "/settings/regions",
    },
    {
      keys: {
        Mac: ["G", ",", "T"],
      },
      label: t("app.keyboardShortcuts.settings.goToTaxRegions"),
      type: "settingShortcut",
      to: "/settings/tax-regions",
    },
    {
      keys: {
        Mac: ["G", ",", "A"],
      },
      label: t("app.keyboardShortcuts.settings.goToSalesChannels"),
      type: "settingShortcut",
      to: "/settings/sales-channels",
    },
    {
      keys: {
        Mac: ["G", ",", "P"],
      },
      label: t("app.keyboardShortcuts.settings.goToProductTypes"),
      type: "settingShortcut",
      to: "/settings/product-types",
    },
    {
      keys: {
        Mac: ["G", ",", "L"],
      },
      label: t("app.keyboardShortcuts.settings.goToLocations"),
      type: "settingShortcut",
      to: "/settings/locations",
    },
    {
      keys: {
        Mac: ["G", ",", "J"],
      },
      label: t("app.keyboardShortcuts.settings.goToPublishableApiKeys"),
      type: "settingShortcut",
      to: "/settings/publishable-api-keys",
    },
    {
      keys: {
        Mac: ["G", ",", "K"],
      },
      label: t("app.keyboardShortcuts.settings.goToSecretApiKeys"),
      type: "settingShortcut",
      to: "/settings/secret-api-keys",
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
    // Commands
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
