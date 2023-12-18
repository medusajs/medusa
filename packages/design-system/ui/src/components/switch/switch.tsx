"use client"

import * as Primitives from "@radix-ui/react-switch"
import { VariantProps, cva } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

const switchVariants = cva({
  base: "bg-ui-bg-switch-off hover:bg-ui-bg-switch-off-hover data-[state=unchecked]:hover:after:bg-switch-off-hover-gradient before:shadow-details-switch-background focus:shadow-details-switch-background-focus data-[state=checked]:bg-ui-bg-interactive disabled:!bg-ui-bg-disabled group relative inline-flex items-center rounded-full outline-none transition-all before:absolute before:inset-0 before:rounded-full before:content-[''] after:absolute after:inset-0 after:rounded-full after:content-[''] disabled:cursor-not-allowed",
  variants: {
    size: {
      small: "h-[16px] w-[28px]",
      base: "h-[18px] w-[32px]",
    },
  },
  defaultVariants: {
    size: "base",
  },
})

const thumbVariants = cva({
  base: "bg-ui-fg-on-color shadow-details-switch-handle group-disabled:bg-ui-fg-disabled pointer-events-none h-[14px] w-[14px] rounded-full transition-all group-disabled:shadow-none",
  variants: {
    size: {
      small:
        "h-[12px] w-[12px] data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0.5",
      base: "h-[14px] w-[14px] transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5",
    },
  },
  defaultVariants: {
    size: "base",
  },
})

interface SwitchProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Primitives.Root>,
      "asChild"
    >,
    VariantProps<typeof switchVariants> {}

/**
 * This component is based on the [Radix UI Switch](https://www.radix-ui.com/primitives/docs/components/switch) primitive.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof Primitives.Root>,
  SwitchProps
>(({ 
    className, 
    /**
     * The switch's size.
     */
    size = "base", 
    ...props 
  }: SwitchProps, ref) => (
  <Primitives.Root
    className={clx(switchVariants({ size }), className)}
    {...props}
    ref={ref}
  >
    <Primitives.Thumb className={clx(thumbVariants({ size }))} />
  </Primitives.Root>
))
Switch.displayName = "Switch"

export { Switch }
