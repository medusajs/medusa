"use client"

import React, { MouseEvent, useMemo } from "react"
import clsx from "clsx"
import { useMobile, useSearch } from "@/providers"
import { Button, Kbd } from "@/components"
import { MagnifyingGlass } from "@medusajs/icons"
import { useKeyboardShortcut } from "@/hooks"

export type SearchModalOpenerProps = {
  isLoading?: boolean
  className?: string
}

export const SearchModalOpener = ({
  isLoading = false,
  className,
}: SearchModalOpenerProps) => {
  const { isMobile } = useMobile()
  const { setIsOpen } = useSearch()
  const isApple = useMemo(() => {
    return typeof navigator !== "undefined"
      ? navigator.userAgent.toLowerCase().indexOf("mac") !== 0
      : true
  }, [])
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
    <>
      {isMobile && (
        <Button variant="transparent" onClick={handleOpen}>
          <MagnifyingGlass className="text-medusa-fg-subtle" />
        </Button>
      )}
      {!isMobile && (
        <div
          className={clsx(
            "relative hover:cursor-pointer group",
            "flex gap-docs_0.5 py-docs_0.125 pl-docs_0.125 pr-docs_0.5",
            "justify-between items-center text-medusa-fg-subtle",
            className
          )}
          onClick={handleOpen}
        >
          <MagnifyingGlass className="text-medusa-fg-subtle" />
          <span className="text-compact-small-plus">Ask or search...</span>
          <Kbd>{isApple ? "⌘" : "Ctrl"}K</Kbd>
        </div>
      )}
    </>
  )
}
