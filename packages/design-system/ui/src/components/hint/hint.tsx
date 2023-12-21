import { VariantProps, cva } from "cva"
import * as React from "react"

import { ExclamationCircleSolid } from "@medusajs/icons"
import { clx } from "../../utils/clx"

const hintVariants = cva({
  base: "txt-compact-xsmall inline-flex items-center gap-x-2",
  variants: {
    variant: {
      info: "text-ui-fg-subtle",
      error: "text-ui-fg-error",
    },
  },
  defaultVariants: {
    variant: "info",
  },
})

interface HintProps extends VariantProps<typeof hintVariants>,
  React.ComponentPropsWithoutRef<"span"> {}

const Hint = React.forwardRef<HTMLSpanElement, HintProps>(
  ({ 
    className, 
    /**
     * The hint's style.
     */
    variant = "info", 
    children, 
    ...props 
  }: HintProps, ref) => {
    return (
      <span
        ref={ref}
        className={clx(hintVariants({ variant }), className)}
        {...props}
      >
        {variant === "error" && <ExclamationCircleSolid />}
        {children}
      </span>
    )
  }
)
Hint.displayName = "Hint"

export { Hint }
