"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components"
import clsx from "clsx"
import { CSSTransition } from "react-transition-group"
import { HelpButtonActions } from "./Actions"
import { useClickOutside } from "../.."

export const HelpButton = () => {
  const [showText, setShowText] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside({
    elmRef: ref,
    onClickOutside: () => {
      setShowHelp(false)
      setShowText(false)
    },
  })

  useEffect(() => {
    if (showHelp) {
      setShowText(true)
    }
  }, [showHelp])

  return (
    <div
      className={clsx(
        "mr-0 ml-auto w-fit",
        "flex flex-col gap-docs_0.5",
        "max-[767px]:fixed max-[767px]:bottom-docs_1 max-[767px]:right-docs_1"
      )}
      ref={ref}
    >
      {showHelp && <HelpButtonActions />}
      <Button
        variant="secondary"
        className={clsx(
          "!p-[10px] !shadow-elevation-flyout dark:!shadow-elevation-flyout-dark !text-medusa-fg-subtle",
          "rounded-full border-0 !flex relative mr-0 ml-auto",
          "h-docs_3 min-w-docs_3 !txt-medium-plus lg:txt-large-plus transition-[width] duration-300",
          !showText && "!gap-0"
        )}
        onMouseOver={() => setShowText(true)}
        onMouseLeave={() => {
          if (!showHelp) {
            setShowText(false)
          }
        }}
        onClick={() => {
          setShowHelp((prev) => !prev)
        }}
      >
        <CSSTransition
          in={showText}
          timeout={300}
          onEnter={(node: HTMLElement) => {
            node.style.width = `0px`
          }}
          onEntering={(node: HTMLElement) => {
            node.style.width = `${node.scrollWidth}px`
            setTimeout(() => {
              node.style.opacity = `1`
            }, 100)
          }}
          onExiting={(node: HTMLElement) => {
            node.style.width = `0px`
            node.style.opacity = `0`
          }}
        >
          <span
            className={clsx("opacity-0 w-0 text-nowrap")}
            style={{
              transition: `width cubic-bezier(0.4, 0, 0.2, 1) 300ms, opacity cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
            }}
          >
            Need help
          </span>
        </CSSTransition>
        <span>?</span>
      </Button>
    </div>
  )
}
