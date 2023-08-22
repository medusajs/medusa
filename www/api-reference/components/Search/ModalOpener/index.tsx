"use client"

import clsx from "clsx"
import IconMagnifyingGlass from "../../Icons/MagnifyingGlass"
import InputText from "../../Input/Text"
import { MouseEvent, useMemo } from "react"
import Kbd from "../../MDXComponents/Kbd"
import { useSearch } from "../../../providers/search"

const SearchModalOpener = () => {
  const { setIsOpen } = useSearch()
  const isApple = useMemo(() => {
    return typeof navigator !== "undefined"
      ? navigator.userAgent.toLowerCase().indexOf("mac") !== 0
      : true
  }, [])

  const handleOpen = (
    e:
      | MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    e.preventDefault()
    if ("blur" in e.target && typeof e.target.blur === "function") {
      e.target.blur()
    }
    setIsOpen(true)
  }

  return (
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
      <span className={clsx("gap-0.25 flex", "absolute right-0.5 top-[5px]")}>
        <Kbd>{isApple ? "⌘" : "Ctrl"}</Kbd>
        <Kbd>K</Kbd>
      </span>
    </div>
  )
}

export default SearchModalOpener
