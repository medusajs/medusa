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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const removeKeys = useCallback(
    debounceFn(() => setKeys([]), debounce),
    []
  )

  useEffect(() => {
    if (keys.length > 0 && shortcuts.length > 0) {
      const shortcut = findShortcut(shortcuts, keys)
      if (shortcut && shortcut.callback) {
        shortcut.callback()
        setKeys([])
      }
    }
  }, [keys, shortcuts])

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
        Mac: ["G", "O", "O"],
      },
      label: t("app.keyboardShortcuts.goToOrders"),
      type: "pageShortcut",
      callback: () => navigate("/orders"),
    },
    {
      keys: {
        Mac: ["G", "P", "P"],
      },
      label: t("app.keyboardShortcuts.goToProducts"),
      type: "pageShortcut",
      callback: () => navigate("/products"),
    },
    {
      keys: {
        Mac: ["G", "P", "C"],
      },
      label: t("app.keyboardShortcuts.goToCollections"),
      type: "pageShortcut",
      callback: () => navigate("/collections"),
    },
    {
      keys: {
        Mac: ["G", "P", "A"],
      },
      label: t("app.keyboardShortcuts.goToCategories"),
      type: "pageShortcut",
      callback: () => navigate("/categories"),
    },
    {
      keys: {
        Mac: ["G", "C", "C"],
      },
      label: t("app.keyboardShortcuts.goToCustomers"),
      type: "pageShortcut",
      callback: () => navigate("/customers"),
    },
    {
      keys: {
        Mac: ["G", "C", "G"],
      },
      label: t("app.keyboardShortcuts.goToCustomerGroups"),
      type: "pageShortcut",
      callback: () => navigate("/customer-groups"),
    },
    {
      keys: {
        Mac: ["G", "I", "I"],
      },
      label: t("app.keyboardShortcuts.goToInventory"),
      type: "pageShortcut",
      callback: () => navigate("/inventory"),
    },
    {
      keys: {
        Mac: ["G", "I", "R"],
      },
      label: t("app.keyboardShortcuts.goToReservations"),
      type: "pageShortcut",
      callback: () => navigate("/reservations"),
    },
    {
      keys: {
        Mac: ["G", "L"],
      },
      label: t("app.keyboardShortcuts.goToPriceLists"),
      type: "pageShortcut",
      callback: () => navigate("/pricing"),
    },
    {
      keys: {
        Mac: ["G", "R", "P"],
      },
      label: t("app.keyboardShortcuts.goToPromotions"),
      type: "pageShortcut",
      callback: () => navigate("/promotions"),
    },
    {
      keys: {
        Mac: ["G", "R", "C"],
      },
      label: t("app.keyboardShortcuts.goToCampaigns"),
      type: "pageShortcut",
      callback: () => navigate("/campaigns"),
    },
    //
    {
      keys: {
        Mac: ["G", "S", "S"],
      },
      label: t("app.keyboardShortcuts.goToStore"),
      type: "settingShortcut",
      callback: () => navigate("/settings/store"),
    },
    {
      keys: {
        Mac: ["G", "S", "U"],
      },
      label: t("app.keyboardShortcuts.goToUsers"),
      type: "settingShortcut",
      callback: () => navigate("/settings/users"),
    },
    {
      keys: {
        Mac: ["G", "S", "R"],
      },
      label: t("app.keyboardShortcuts.goToRegions"),
      type: "settingShortcut",
      callback: () => navigate("/settings/regions"),
    },
    {
      keys: {
        Mac: ["G", "S", "T"],
      },
      label: t("app.keyboardShortcuts.goToTaxRegions"),
      type: "settingShortcut",
      callback: () => navigate("/settings/taxes"),
    },
    {
      keys: {
        Mac: ["G", "S", "A"],
      },
      label: t("app.keyboardShortcuts.goToSalesChannels"),
      type: "settingShortcut",
      callback: () => navigate("/settings/sales-channels"),
    },
    {
      keys: {
        Mac: ["G", "S", "P"],
      },
      label: t("app.keyboardShortcuts.goToProductTypes"),
      type: "settingShortcut",
      callback: () => navigate("/settings/product-types"),
    },
    {
      keys: {
        Mac: ["G", "S", "L"],
      },
      label: t("app.keyboardShortcuts.goToLocations"),
      type: "settingShortcut",
      callback: () => navigate("/settings/locations"),
    },
    {
      keys: {
        Mac: ["G", "S", "J"],
      },
      label: t("app.keyboardShortcuts.goToPublishableApiKeys"),
      type: "settingShortcut",
      callback: () => navigate("/settings/publishable-api-keys"),
    },
    {
      keys: {
        Mac: ["G", "S", "K"],
      },
      label: t("app.keyboardShortcuts.goToSecretApiKeys"),
      type: "settingShortcut",
      callback: () => navigate("/settings/secret-api-keys"),
    },
    {
      keys: {
        Mac: ["G", "S", "W"],
      },
      label: t("app.keyboardShortcuts.goToWorkflows"),
      type: "settingShortcut",
      callback: () => navigate("/settings/workflows"),
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
