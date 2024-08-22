"use client"

import React from "react"

export const MenuDivider = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 205 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="197"
        height="8"
        transform="translate(4)"
        fill="var(--docs-bg-component)"
      />
      <rect
        x="-4"
        y="3"
        width="213"
        height="1"
        fill="var(--docs-border-menu-top)"
      />
      <rect
        x="-4"
        y="4"
        width="213"
        height="1"
        fill="var(--docs-border-menu-bot)"
      />
    </svg>
  )
}
