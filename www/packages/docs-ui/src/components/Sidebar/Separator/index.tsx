"use client"

import clsx from "clsx"
import React from "react"

export type SidebarSeparatorProps = {
  className?: string
}

export const SidebarSeparator = ({ className }: SidebarSeparatorProps) => {
  return (
    <span
      className={clsx(
        "block w-full h-px relative my-docs_0.75",
        "bg-border-dotted dark:bg-border-dotted-dark",
        "bg-[length:3px_1px] bg-repeat-x bg-bottom",
        className
      )}
    ></span>
  )
}
