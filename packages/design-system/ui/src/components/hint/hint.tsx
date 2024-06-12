import { ExclamationCircleSolid } from "@medusajs/icons"
import { VariantProps, cva } from "cva"
import * as React from "react"

import { clx } from "../../utils/clx"

const hintVariants = cva({
  base: "txt-small",
  variants: {
    variant: {
      info: "text-ui-fg-subtle",
      error: "text-ui-fg-error grid grid-cols-[20px_1fr] gap-1 items-start",
    },
  },
  defaultVariants: {
    variant: "info",
  },
})

interface HintProps
  extends VariantProps<typeof hintVariants>,
    React.ComponentPropsWithoutRef<"span"> {}

const Hint = React.forwardRef<HTMLSpanElement, HintProps>(
  (
    {
      className,
      /**
       * The hint's style.
       */
      variant = "info",
      children,
      ...props
    }: HintProps,
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={clx(hintVariants({ variant }), className)}
        {...props}
      >
        {variant === "error" && <div className="size-5 flex items-center justify-center"><ExclamationCircleSolid /></div>}
        {children}
      </span>
    )
  }
)
Hint.displayName = "Hint"

export { Hint }
