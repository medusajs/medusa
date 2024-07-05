"use client"

import { Copy } from "@/components/copy"
import { clx } from "@/utils/clx"
import React from "react"

/**
 * This component is based on the div element and supports all of its props
 */
const CommandComponent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clx(
        "bg-ui-code-bg-base border-ui-code-border flex items-center rounded-lg border px-3 py-2",
        "[&>code]:text-ui-code-fg-base [&>code]:code-body [&>code]:mx-3",
        className
      )}
      {...props}
    />
  )
}
CommandComponent.displayName = "Command"

const CommandCopy = React.forwardRef<
  React.ElementRef<typeof Copy>,
  React.ComponentPropsWithoutRef<typeof Copy>
>(({ className, ...props }, ref) => {
  return (
    <Copy
      {...props}
      ref={ref}
      className={clx("!text-ui-code-fg-muted ml-auto", className)}
    />
  )
})
CommandCopy.displayName = "Command.Copy"

const Command = Object.assign(CommandComponent, { Copy: CommandCopy })

export { Command }
