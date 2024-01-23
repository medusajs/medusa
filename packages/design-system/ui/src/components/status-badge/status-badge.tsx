import * as React from "react"

import { clx } from "@/utils/clx"
import { VariantProps, cva } from "cva"

const statusBadgeVariants = cva({
  base: "txt-compact-xsmall-plus leading-none bg-ui-bg-subtle text-ui-fg-subtle border border-ui-border-base flex items-center select-none w-fit box-border overflow-hidden",
  variants: {
    size: {
      small: "pl-0.5 pr-2 py-[3px] rounded-md gap-x-0.5",
      xsmall: "pl-0 pr-1.5 py-px rounded-md",
      "2xsmall": "pl-0 pr-1 rounded-md",
    },
  },
  defaultVariants: {
    size: "2xsmall",
  },
})

const dotVariants = cva({
  base: "flex items-center justify-center w-5 h-[18px] [&_div]:w-2 [&_div]:h-2 [&_div]:rounded-sm",
  variants: {
    color: {
      green: "[&_div]:bg-ui-tag-green-icon",
      red: "[&_div]:bg-ui-tag-red-icon",
      orange: "[&_div]:bg-ui-tag-orange-icon",
      blue: "[&_div]:bg-ui-tag-blue-icon",
      purple: "[&_div]:bg-ui-tag-purple-icon",
      grey: "[&_div]:bg-ui-tag-neutral-icon",
    },
  },
  defaultVariants: {
    color: "grey",
  },
})

interface StatusBadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "color">,
    VariantProps<typeof statusBadgeVariants>,
    VariantProps<typeof dotVariants> {}

/**
 * This component is based on the span element and supports all of its props
 */
const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      children,
      className,
      /**
       * The status's color.
       */
      color = "grey",
      /**
       * The size of the badge.
       */
      size = "2xsmall",
      ...props
    }: StatusBadgeProps,
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={clx(statusBadgeVariants({ size }), className)}
        {...props}
      >
        <div role="presentation" className={dotVariants({ color })}>
          <div />
        </div>
        {children}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge }
