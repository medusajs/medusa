"use client"

import { useCallback, useEffect } from "react"

export type useKeyboardShortcutOptions = {
  metakey?: boolean
  shortcutKeys: string[]
  action: (e: KeyboardEvent) => void
  checkEditing?: boolean
  preventDefault?: boolean
  isLoading?: boolean
}

export const useKeyboardShortcut = ({
  metakey = true,
  shortcutKeys,
  action,
  checkEditing = true,
  preventDefault = true,
  isLoading = false,
}: useKeyboardShortcutOptions) => {
  function isEditingContent(event: KeyboardEvent) {
    const element = event.target as HTMLElement
    const tagName = element.tagName
    return (
      element.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "SELECT" ||
      tagName === "TEXTAREA"
    )
  }

  const checkKeysPressed = useCallback(
    (pressedKey: string) => {
      const lowerPressedKey = pressedKey.toLowerCase()
      return shortcutKeys.some(
        (value) => lowerPressedKey === value.toLowerCase()
      )
    },
    [shortcutKeys]
  )

  const sidebarShortcut = useCallback(
    (e: KeyboardEvent) => {
      // the event is triggered when an input
      // autocompletes, and in that case
      // e.key will be empty
      if (isLoading || !e.key) {
        return
      }
      if (
        (!metakey || e.metaKey || e.ctrlKey) &&
        checkKeysPressed(e.key) &&
        (!checkEditing || !isEditingContent(e))
      ) {
        if (preventDefault) {
          e.preventDefault()
        }
        action(e)
      }
    },
    [isLoading, metakey, checkKeysPressed, checkEditing, action, preventDefault]
  )

  useEffect(() => {
    window.addEventListener("keydown", sidebarShortcut)

    return () => {
      window.removeEventListener("keydown", sidebarShortcut)
    }
  }, [sidebarShortcut])
}
