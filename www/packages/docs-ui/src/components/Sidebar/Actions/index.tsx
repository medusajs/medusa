"use client"

import clsx from "clsx"
import React from "react"
import { SidebarActionColorMode } from "./ColorMode"

export const SidebarActions = React.forwardRef<HTMLDivElement>(
  function SidebarActions(_props, ref) {
    return (
      <div
        className={clsx(
          "p-docs_0.75 border-t border-base",
          "flex flex-col gap-docs_0.125"
        )}
        ref={ref}
      >
        <SidebarActionColorMode />
      </div>
    )
  }
)
