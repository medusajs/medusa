"use client"

import React from "react"
import { useColorMode } from "../../../../providers"
import clsx from "clsx"
import { EllipseMiniSolid } from "@medusajs/icons"

export const MainNavThemeMenu = () => {
  const { colorMode, setColorMode } = useColorMode()

  return (
    <>
      <div
        className={clsx(
          "flex items-center gap-docs_0.5",
          "py-docs_0.25 px-docs_0.5",
          "rounded-docs_xs text-compact-x-small-plus",
          "text-medusa-fg-subtle"
        )}
      >
        Theme
      </div>
      <div className="px-docs_0.25">
        <div
          className={clsx(
            "flex items-center gap-docs_0.5",
            "py-docs_0.25 px-docs_0.5 cursor-pointer",
            "rounded-docs_xs text-medusa-fg-base",
            "hover:bg-medusa-bg-component-hover"
          )}
          tabIndex={-1}
          onClick={() => setColorMode("light")}
        >
          <EllipseMiniSolid
            className={clsx(colorMode !== "light" && "invisible")}
          />
          <span
            className={clsx(
              colorMode !== "light" && "text-compact-small",
              colorMode === "light" && "text-compact-small-plus"
            )}
          >
            Light
          </span>
        </div>
      </div>
      <div className="px-docs_0.25">
        <div
          className={clsx(
            "flex items-center gap-docs_0.5",
            "py-docs_0.25 px-docs_0.5 cursor-pointer",
            "rounded-docs_xs text-medusa-fg-base",
            "hover:bg-medusa-bg-component-hover"
          )}
          tabIndex={-1}
          onClick={() => setColorMode("dark")}
        >
          <EllipseMiniSolid
            className={clsx(colorMode !== "dark" && "invisible")}
          />
          <span
            className={clsx(
              colorMode !== "dark" && "text-compact-small",
              colorMode === "dark" && "text-compact-small-plus"
            )}
          >
            Dark
          </span>
        </div>
      </div>
    </>
  )
}
