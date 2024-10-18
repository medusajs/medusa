"use client"

import React, { MouseEvent } from "react"
import { useSearch } from "@/providers"
import { Button } from "@/components"
import { MagnifyingGlass } from "@medusajs/icons"
import { useKeyboardShortcut } from "@/hooks"

export type SearchModalOpenerProps = {
  isLoading?: boolean
  className?: string
}

export const SearchModalOpener = ({
  isLoading = false,
}: SearchModalOpenerProps) => {
  const { setIsOpen } = useSearch()
  useKeyboardShortcut({
    shortcutKeys: ["k"],
    action: () => setIsOpen((prev) => !prev),
    isLoading,
  })

  const handleOpen = (
    e:
      | MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | MouseEvent<HTMLInputElement, globalThis.MouseEvent>
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (isLoading) {
      return
    }
    e.preventDefault()
    if ("blur" in e.target && typeof e.target.blur === "function") {
      e.target.blur()
    }
    setIsOpen(true)
  }

  return (
    <Button
      variant="transparent"
      onClick={handleOpen}
      className="flex !p-[6.5px]"
    >
      <MagnifyingGlass className="text-medusa-fg-subtle" />
    </Button>
  )
}
