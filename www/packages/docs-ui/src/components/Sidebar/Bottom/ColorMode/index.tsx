"use client"

import React from "react"
import { Moon, Sun } from "@medusajs/icons"
import { useColorMode } from "@/providers"
import clsx from "clsx"

export const SidebarActionColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <div
      className={clsx(
        "px-docs_0.5 py-docs_0.25 cursor-pointer",
        "flex justify-start items-center gap-[10px]",
        "text-medusa-fg-subtle hover:bg-medusa-bg-subtle-hover"
      )}
      tabIndex={-1}
      onClick={() => toggleColorMode()}
    >
      <>
        {colorMode === "light" && <Sun />}
        {colorMode === "dark" && <Moon />}
      </>
      <span className="text-compact-small-plus">
        {colorMode === "light" ? "Light" : "Dark"} Theme
      </span>
    </div>
  )
}
