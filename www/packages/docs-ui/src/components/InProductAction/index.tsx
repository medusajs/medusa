"use client"

import React from "react"
import { ProductView, useSiteConfig } from "../../providers/SiteConfig"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import clsx from "clsx"
import { DocsTrackingEvents } from "../../constants"
import { useAnalytics } from "../../providers/Analytics"

export type InProductActionProps = {
  product: ProductView
  renderType: "default"
  type: string
  data?: Record<string, unknown>
  children?: React.ReactNode
}

export const InProductAction = ({
  product,
  renderType,
  type,
  data,
  children,
}: InProductActionProps) => {
  const { productView } = useSiteConfig()
  const { track } = useAnalytics()

  if (productView !== product) {
    return <>{children}</>
  }

  const handleClick = () => {
    window.parent.postMessage(
      {
        type,
        data,
      },
      "*"
    )
    track({
      event: {
        event: DocsTrackingEvents.BLOOM_ACTION,
        options: {
          type,
          ...data,
        },
      },
    })
  }

  // TODO add handling for other render types

  return (
    <span
      className={clsx(
        "border-b border-dashed border-medusa-fg-muted hover:border-medusa-fg-interactive",
        "font-medium transition-colors cursor-pointer",
        "inline-flex items-center gap-0.25"
      )}
      onClick={handleClick}
      tabIndex={-1}
    >
      <span>{children}</span>
      <ArrowUpRightOnBox />
    </span>
  )
}
