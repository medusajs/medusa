"use client"

import React, { useEffect } from "react"
import { Button } from "../../Button"
import { TriangleDownMini } from "@medusajs/icons"
import clsx from "clsx"
import { ContentMenuSectionDivider } from "../Divider"
import { useIsBrowser } from "../../.."

export type ContentMenuSectionProps = {
  title: string
  children: React.ReactNode
  hideChildrenDivider?: boolean
}

export const ContentMenuSection = ({
  title,
  children,
  hideChildrenDivider = false,
}: ContentMenuSectionProps) => {
  const [open, setOpen] = React.useState(true)
  const { isBrowser } = useIsBrowser()
  const localStorageKey = `content-menu-section-${title.toLowerCase().replace(/\s/g, "-")}`
  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const storedState = localStorage.getItem(localStorageKey)
    if (storedState !== null) {
      setOpen(storedState === "true")
    }
  }, [isBrowser, localStorageKey])

  const toggleOpen = () => {
    setOpen((prev) => {
      const newState = !prev
      if (isBrowser) {
        localStorage.setItem(localStorageKey, newState.toString())
      }
      return newState
    })
  }

  if (!children) {
    return null
  }

  return (
    <>
      <div
        className={clsx(
          "py-docs_0.75 px-docs_1 flex gap-docs_0.25 justify-between",
          "cursor-pointer items-center text-medusa-fg-muted"
        )}
        onClick={toggleOpen}
        data-testid="content-menu-section-header"
      >
        <span className="uppercase text-code-label font-monospace">
          [{title}]
        </span>
        <Button variant="transparent" className="!p-[2.5px]">
          <TriangleDownMini
            className={clsx("transition-transform", !open && "rotate-180")}
          />
        </Button>
      </div>
      <ContentMenuSectionDivider />
      {open && (
        <>
          {children}
          {!hideChildrenDivider && <ContentMenuSectionDivider />}
        </>
      )}
    </>
  )
}
