"use client"

import { MagnifyingGlass, XMark } from "@medusajs/icons"
import clsx from "clsx"
import React from "react"
import { useKeyboardShortcut } from "../../../hooks/use-keyboard-shortcut"
import { Kbd } from "../../Kbd"

type SearchInputProps = {
  onChange: (value: string) => void
} & Omit<React.ComponentProps<"input">, "onChange">

export const SearchInput = ({
  value,
  onChange,
  className,
  placeholder = "Search...",
  ...props
}: SearchInputProps) => {
  useKeyboardShortcut({
    metakey: false,
    shortcutKeys: ["escape"],
    action: () => onChange(""),
    checkEditing: false,
    preventDefault: true,
  })

  return (
    <div className="flex flex-col gap-docs_0.5">
      <div className="relative">
        <MagnifyingGlass className="absolute left-docs_0.5 top-[8.5px] bottom-[8.5px] text-medusa-fg-muted" />
        <input
          type="text"
          placeholder={placeholder}
          className={clsx(
            "w-full h-docs_2 pl-docs_2 text-base md:text-compact-small placeholder:text-medusa-fg-muted",
            "bg-medusa-bg-field text-medusa-fg-base rounded-full",
            "shadow-borders-base hover:bg-medusa-bg-field-hover",
            "focus:bg-medusa-bg-field focus:shadow-borders-interactive-with-active focus:outline-none",
            className
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
        {value && (
          <button
            className={clsx(
              "absolute right-docs_0.5 top-[8.5px] bottom-[8.5px] appearance-none",
              "flex items-center justify-center"
            )}
            onClick={() => onChange("")}
            data-testid="clear-button"
          >
            <XMark className="text-medusa-fg-muted" />
          </button>
        )}
      </div>
      <span className="flex gap-docs_0.25 justify-end items-center text-compact-x-small">
        <Kbd variant="small">esc</Kbd>
        <span className="text-medusa-fg-muted">Clear Search</span>
      </span>
    </div>
  )
}
