import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

const badgeColorVariants = cva({
  variants: {
    color: {
      green:
        "bg-ui-tag-green-bg text-ui-tag-green-text [&_svg]:text-ui-tag-green-icon border-ui-tag-green-border",
      red: "bg-ui-tag-red-bg text-ui-tag-red-text [&_svg]:text-ui-tag-red-icon border-ui-tag-red-border",
      blue: "bg-ui-tag-blue-bg text-ui-tag-blue-text [&_svg]:text-ui-tag-blue-icon border-ui-tag-blue-border",
      orange:
        "bg-ui-tag-orange-bg text-ui-tag-orange-text [&_svg]:text-ui-tag-orange-icon border-ui-tag-orange-border",
      grey: "bg-ui-tag-neutral-bg text-ui-tag-neutral-text [&_svg]:text-ui-tag-neutral-icon border-ui-tag-neutral-border",
      purple:
        "bg-ui-tag-purple-bg text-ui-tag-purple-text [&_svg]:text-ui-tag-purple-icon border-ui-tag-purple-border",
    },
  },
  defaultVariants: {
    color: "grey",
  },
})

const badgeSizeVariants = cva({
  base: "inline-flex items-center gap-x-0.5 border",
  variants: {
    size: {
      small: "txt-compact-xsmall-plus px-1.5",
      base: "txt-compact-small-plus px-2 py-0.5",
      large: "txt-compact-medium-plus px-2.5 py-1",
    },
    rounded: {
      base: "rounded-md",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    size: "base",
    rounded: "base",
  },
})

interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeSizeVariants>,
    VariantProps<typeof badgeColorVariants> {
  asChild?: boolean
}

/**
 * This component is based on the `div` element and supports all of its props
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      /**
       * The badge's size.
       */
      size = "base",
      /**
       * The style of the badge's border radius.
       */
      rounded = "base",
      /**
       * The badge's color.
       */
      color = "grey",
      /**
       * Whether to remove the wrapper `span` element and use the
       * passed child element instead.
       */
      asChild = false,
      ...props
    }: BadgeProps,
    ref
  ) => {
    const Component = asChild ? Slot : "span"

    return (
      <Component
        ref={ref}
        className={clx(
          badgeColorVariants({ color }),
          badgeSizeVariants({ size, rounded }),
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeColorVariants }
