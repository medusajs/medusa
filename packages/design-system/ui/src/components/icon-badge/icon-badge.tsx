import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "cva"
import * as React from "react"

import { badgeColorVariants } from "@/components/badge"
import { clx } from "@/utils/clx"

const iconBadgeVariants = cva({
  base: "flex items-center justify-center overflow-hidden rounded-md border",
  variants: {
    size: {
      base: "h-6 w-6",
      large: "h-7 w-7",
    },
  },
})

/**
 * @prop color - The badge's color.
 * @prop size - The badge's size.
 */
interface IconBadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "color">,
    VariantProps<typeof badgeColorVariants>,
    VariantProps<typeof iconBadgeVariants> {
  /**
   * Whether to remove the wrapper `span` element and use the
   * passed child element instead.
   */
  asChild?: boolean
}

/**
 * This component is based on the `span` element and supports all props of this element.
 */
const IconBadge = React.forwardRef<HTMLSpanElement, IconBadgeProps>(
  (
    {
      children,
      className,
      color = "grey",
      size = "base",
      asChild = false,
      ...props
    }: IconBadgeProps,
    ref
  ) => {
    const Component = asChild ? Slot : "span"

    return (
      <Component
        ref={ref}
        className={clx(
          badgeColorVariants({ color }),
          iconBadgeVariants({ size }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
IconBadge.displayName = "IconBadge"

export { IconBadge }
