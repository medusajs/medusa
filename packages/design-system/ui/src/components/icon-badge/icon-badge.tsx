import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { badgeColorVariants } from "@/components/badge"
import { clx } from "@/utils/clx"

const iconBadgeVariants = cva(
  "flex items-center justify-center overflow-hidden rounded-md border",
  {
    variants: {
      size: {
        base: "h-6 w-6",
        large: "h-7 w-7",
      },
    },
  }
)

interface IconBadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "color">,
    VariantProps<typeof badgeColorVariants>,
    VariantProps<typeof iconBadgeVariants> {
  asChild?: boolean
}

const IconBadge = React.forwardRef<HTMLSpanElement, IconBadgeProps>(
  (
    {
      children,
      className,
      color = "grey",
      size = "base",
      asChild = false,
      ...props
    },
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
