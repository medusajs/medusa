"use client"

import { Copy } from "@/components/copy"
import { clx } from "@/utils/clx"
import React from "react"

const CommandComponent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clx(
        "bg-ui-code-bg-header border-ui-code-border flex items-center rounded-lg border px-3 py-2",
        "[&>code]:text-ui-code-text-base [&>code]:txt-compact-small [&>code]:mx-3 [&>code]:font-mono [&>code]:leading-6",
        className
      )}
      {...props}
    />
  )
}

const Command = Object.assign(CommandComponent, { Copy })

export { Command }
