"use client"

import React, { MouseEvent, useMemo } from "react"
import clsx from "clsx"
import { useSearch } from "@/providers"
import { Button, InputText, Kbd } from "@/components"
import { MagnifyingGlass } from "@medusajs/icons"
import { useKeyboardShortcut } from "@/hooks"

export type SearchModalOpenerProps = {
  isLoading?: boolean
  isMobile?: boolean
}

export const SearchModalOpener = ({
  isLoading = false,
  isMobile = false,
}: SearchModalOpenerProps) => {
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
          <MagnifyingGlass className="text-medusa-fg-muted" />
        </Button>
      )}
      {!isMobile && (
        <div
          className={clsx("relative w-min hover:cursor-pointer group")}
          onClick={handleOpen}
        >
          <MagnifyingGlass
            className={clsx(
              "absolute left-docs_0.5 top-[5px]",
              "text-medusa-fg-muted"
            )}
          />
          <InputText
            type="search"
            className={clsx(
              "placeholder:text-compact-small",
              "!py-[5px] !pl-[36px] !pr-docs_0.5",
              "cursor-pointer select-none"
            )}
            placeholder="Find something"
            onClick={handleOpen}
            onFocus={(e) => e.target.blur()}
            tabIndex={-1}
            addGroupStyling={true}
          />
          <span
            className={clsx(
              "gap-docs_0.25 flex",
              "absolute right-docs_0.5 top-[5px]"
            )}
          >
            <Kbd>{isApple ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </div>
      )}
    </>
  )
}
