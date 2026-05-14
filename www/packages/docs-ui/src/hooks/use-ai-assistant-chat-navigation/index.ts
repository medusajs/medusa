"use client"

import { useCallback, useEffect, useMemo } from "react"
import { useAiAssistant } from "@/providers/AiAssistant"
import { findNextSibling, findPrevSibling } from "@/utils"
import {
  useKeyboardShortcut,
  type useKeyboardShortcutOptions,
} from "../use-keyboard-shortcut"

export type UseAiAssistantChatNavigationProps = {
  getChatWindowElm: () => HTMLElement | null
  getInputElm: () => HTMLTextAreaElement | null
  focusInput: () => void
  keyboardProps?: Partial<useKeyboardShortcutOptions>
  question: string
}

export const useAiAssistantChatNavigation = ({
  getInputElm,
  focusInput,
  keyboardProps,
  getChatWindowElm,
  question,
}: UseAiAssistantChatNavigationProps) => {
  const shortcutKeys = useMemo(() => ["ArrowUp", "ArrowDown", "Enter"], [])
  const { chatOpened } = useAiAssistant()

  const handleKeyAction = (e: KeyboardEvent) => {
    const chatElm = getChatWindowElm()
    if (
      !chatOpened ||
      e.metaKey ||
      e.ctrlKey ||
      !chatElm?.contains(document.activeElement) ||
      (question.length && question.includes("\n"))
    ) {
      return
    }
    e.preventDefault()
    const focusedItem = chatElm?.querySelector(":focus") as HTMLElement
    if (!focusedItem) {
      // focus the first data-hit
      const nextItem = chatElm?.querySelector("[data-hit]") as HTMLElement
      nextItem?.focus()
      return
    }

    const isHit = focusedItem.hasAttribute("data-hit")
    const isInput = focusedItem.tagName.toLowerCase() === "textarea"

    if (!isHit && !isInput) {
      // ignore if focused items aren't input/data-hit
      return
    }

    const lowerPressedKey = e.key.toLowerCase()

    if (lowerPressedKey === "enter") {
      if (isHit) {
        // trigger click event of the focused element
        focusedItem.click()
      }
      return
    }

    if (lowerPressedKey === "arrowdown") {
      // only hit items has action on arrow down
      if (isHit) {
        // find if there's a data-hit item before this one
        const beforeItem = findNextSibling(focusedItem, "[data-hit]")
        if (!beforeItem) {
          // focus the input
          focusInput()
        } else {
          // focus the previous item
          beforeItem.focus()
        }
      }
    } else if (lowerPressedKey === "arrowup") {
      // check if item is input or hit
      if (isInput) {
        // go to the first data-hit item
        const nextItem = chatElm?.querySelector(
          "[data-hit]:last-child"
        ) as HTMLElement
        nextItem?.focus()
      } else {
        // handle go down for hit items
        // find if there's a data-hit item after this one
        const afterItem = findPrevSibling(focusedItem, "[data-hit]")
        if (afterItem) {
          // focus the next item
          afterItem.focus()
        }
      }
    }
  }

  /** Handles starting to type which focuses the input */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!chatOpened) {
        return
      }
      // check if shortcut keys were pressed
      const lowerPressedKey = e.key.toLowerCase()
      const pressedShortcut = [...shortcutKeys, "Escape"].some(
        (s) => s.toLowerCase() === lowerPressedKey
      )
      if (pressedShortcut) {
        return
      }

      const chatElm = getChatWindowElm()
      if (!chatElm?.contains(document.activeElement)) {
        return
      }
      const focusedItem = chatElm?.querySelector(":focus") as HTMLElement
      const inputElm = getInputElm()
      if (inputElm && focusedItem !== inputElm) {
        focusInput()
      }
    },
    [shortcutKeys, chatOpened, shortcutKeys, getInputElm, focusInput]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  useKeyboardShortcut({
    metakey: false,
    shortcutKeys: shortcutKeys,
    checkEditing: false,
    isLoading: false,
    preventDefault: false,
    action: handleKeyAction,
    ...keyboardProps,
  })
}
