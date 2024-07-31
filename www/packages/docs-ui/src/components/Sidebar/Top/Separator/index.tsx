"use client"

import clsx from "clsx"
import React from "react"

export const SidebarTopSeparator = () => {
  return (
    <span
      className={clsx(
        "block w-full h-px",
        "after:content-[''] after:absolute after:w-full after:h-full",
        "after:border-t after:border-dotted after:bottom-1 after:left-0"
      )}
    ></span>
  )
}
