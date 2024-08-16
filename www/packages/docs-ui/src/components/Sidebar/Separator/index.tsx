"use client"

import clsx from "clsx"
import React from "react"

export type SidebarSeparatorProps = {
  className?: string
}

export const SidebarSeparator = ({ className }: SidebarSeparatorProps) => {
  return (
    <div className="px-docs_0.75">
      <span
        className={clsx(
          "block w-full h-px relative my-docs_0.75 bg-border-dotted",
          "bg-[length:4px_1px] bg-repeat-x bg-bottom",
          className
        )}
      ></span>
    </div>
  )
}
