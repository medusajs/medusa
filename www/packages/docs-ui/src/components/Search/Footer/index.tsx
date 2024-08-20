import clsx from "clsx"
import React from "react"
import { Kbd } from "../../.."

export const SearchFooter = () => {
  return (
    <div
      className={clsx(
        "py-docs_0.75 hidden md:flex items-center justify-end px-docs_1",
        "border-medusa-border-base border-t",
        "bg-medusa-bg-field-component"
      )}
    >
      <div className="flex items-center gap-docs_0.75">
        <div className="flex items-center gap-docs_0.5">
          <span
            className={clsx("text-medusa-fg-subtle", "text-compact-x-small")}
          >
            Navigation
          </span>
          <span className="gap-[5px] flex">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
          </span>
        </div>
        <div className={clsx("h-docs_0.75 w-px bg-medusa-border-strong")}></div>
        <div className="flex items-center gap-docs_0.5">
          <span
            className={clsx("text-medusa-fg-subtle", "text-compact-x-small")}
          >
            Open Result
          </span>
          <Kbd>↵</Kbd>
        </div>
      </div>
    </div>
  )
}
