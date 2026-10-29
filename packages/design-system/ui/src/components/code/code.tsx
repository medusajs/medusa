import { clx } from "@/utils/clx"
import * as React from "react"

/**
 * This component is based on the `code` element and supports all of its props
 */
const Code = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"code">
>(({ className, ...props }, ref) => {
  return (
    <code
      ref={ref}
      className={clx(
        "txt-compact-small inline-flex rounded-md border border-ui-tag-neutral-border bg-ui-tag-neutral-bg px-[6px] font-mono text-ui-tag-neutral-text",
        className
      )}
      {...props}
    />
  )
})

Code.displayName = "Code"

export { Code }
