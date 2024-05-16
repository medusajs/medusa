"use client"

import React, { useState } from "react"
import { CSSTransition } from "react-transition-group"

type CollapsibleProps = {
  initialValue?: boolean
  heightAnimation?: boolean
  translateEnabled?: boolean
  onClose?: () => void
  unmountOnExit?: boolean
}

export const useCollapsible = ({
  initialValue = true,
  heightAnimation = false,
  translateEnabled = true,
  onClose,
  unmountOnExit = true,
}: CollapsibleProps) => {
  const [collapsed, setCollapsed] = useState(initialValue)

  const getCollapsibleElms = (children: React.ReactNode) => (
    <CSSTransition
      unmountOnExit={unmountOnExit}
      in={!collapsed}
      timeout={150}
      onEnter={(node: HTMLElement) => {
        if (heightAnimation) {
          node.classList.add("transition-[height]")
          node.style.height = `0px`
        } else {
          node.classList.add("!mb-docs_2", "!mt-0")
          if (translateEnabled) {
            node.classList.add("translate-y-docs_1", "transition-transform")
          }
        }
      }}
      onEntering={(node: HTMLElement) => {
        if (heightAnimation) {
          node.style.height = `${node.scrollHeight}px`
        }
      }}
      onEntered={(node: HTMLElement) => {
        if (heightAnimation) {
          node.style.height = `auto`
        }
      }}
      onExit={(node: HTMLElement) => {
        if (heightAnimation) {
          node.style.height = `${node.scrollHeight}px`
        } else {
          if (translateEnabled) {
            node.classList.add("transition-transform", "!-translate-y-docs_1")
          }
          setTimeout(() => {
            onClose?.()
          }, 100)
        }
      }}
      onExiting={(node: HTMLElement) => {
        if (heightAnimation) {
          node.style.height = `0px`
          setTimeout(() => {
            onClose?.()
          }, 100)
        }
      }}
    >
      {children}
    </CSSTransition>
  )

  return {
    getCollapsibleElms,
    collapsed,
    setCollapsed,
  }
}
