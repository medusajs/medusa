"use client"

import React from "react"
import { useSidebar } from "../../../providers"
import clsx from "clsx"
import { ArrowUturnLeft } from "@medusajs/icons"

export const SidebarBack = () => {
  const { goBack } = useSidebar()

  return (
    <div
      className={clsx(
        "mb-docs_1.5 cursor-pointer",
        "flex items-center gap-docs_0.5 rounded-docs_sm px-docs_0.5 py-[6px] hover:no-underline",
        "border border-transparent",
        "text-medusa-fg-subtle text-medium-plus"
      )}
      tabIndex={-1}
      onClick={goBack}
    >
      <ArrowUturnLeft className="mr-docs_0.5" />
      <span>Back</span>
    </div>
  )
}
