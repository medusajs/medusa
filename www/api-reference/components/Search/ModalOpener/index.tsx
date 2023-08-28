"use client"

import clsx from "clsx"
import IconMagnifyingGlass from "../../Icons/MagnifyingGlass"
import InputText from "../../Input/Text"
import { MouseEvent, useMemo } from "react"
import Kbd from "../../MDXComponents/Kbd"
import { useSearch } from "../../../providers/search"
import { useMobile } from "../../../providers/mobile"
import Button from "../../Button"
import { usePageLoading } from "../../../providers/page-loading"
import useKeyboardShortcut from "../../../hooks/use-keyboard-shortcut"

const SearchModalOpener = () => {
  const { setIsOpen } = useSearch()
  const { isMobile } = useMobile()
  const isApple = useMemo(() => {
    return typeof navigator !== "undefined"
      ? navigator.userAgent.toLowerCase().indexOf("mac") !== 0
      : true
  }, [])
  const { isLoading } = usePageLoading()
  useKeyboardShortcut({
    shortcutKeys: ["k"],
    action: () => setIsOpen((prev) => !prev),
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
        <Button variant="clear" onClick={handleOpen}>
          <IconMagnifyingGlass iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
        </Button>
      )}
      {!isMobile && (
        <div
          className={clsx("relative w-min hover:cursor-pointer")}
          onClick={handleOpen}
        >
          <IconMagnifyingGlass
            iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark"
            className={clsx("absolute left-0.5 top-[5px]")}
          />
          <InputText
            type="search"
            className={clsx(
              "placeholder:text-compact-small",
              "!py-[5px] !pl-[36px] !pr-[8px]",
              "cursor-pointer select-none"
            )}
            placeholder="Find something"
            onClick={handleOpen}
            onFocus={(e) => e.target.blur()}
            tabIndex={-1}
          />
          <span
            className={clsx("gap-0.25 flex", "absolute right-0.5 top-[5px]")}
          >
            <Kbd>{isApple ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </div>
      )}
    </>
  )
}

export default SearchModalOpener
