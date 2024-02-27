import * as React from "react"

import { clx } from "@/utils/clx"

/**
 * This component is based on the `kbd` element and supports all of its props
 */
const Kbd = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"kbd">
>(({ children, className, ...props }, ref) => {
  return (
    <kbd
      {...props}
      ref={ref}
      className={clx(
        "bg-ui-tag-neutral-bg text-ui-tag-neutral-text border-ui-tag-neutral-border inline-flex h-5 w-fit min-w-[20px] items-center justify-center rounded-md border px-1",
        "txt-compact-xsmall-plus",
        className
      )}
    >
      {children}
    </kbd>
  )
})
Kbd.displayName = "Kbd"

export { Kbd }
