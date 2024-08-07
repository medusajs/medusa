"use client"

import clsx from "clsx"
import React from "react"
import { SidebarActionColorMode } from "./ColorMode"
import { MedusaMenu } from "./MedusaMenu"

export const SidebarBottom = React.forwardRef<HTMLDivElement>(
  function SidebarBottom(_props, ref) {
    return (
      <div ref={ref}>
        <div
          className={clsx(
            "p-docs_0.75 border-t border-medusa-border-base",
            "flex flex-col gap-docs_0.125"
          )}
        >
          <SidebarActionColorMode />
        </div>
        <MedusaMenu />
      </div>
    )
  }
)
