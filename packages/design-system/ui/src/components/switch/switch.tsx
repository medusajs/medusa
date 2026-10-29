"use client"

import { VariantProps, cva } from "cva"
import { Switch as RadixSwitch } from "radix-ui"
import * as React from "react"

import { clx } from "@/utils/clx"

const switchVariants = cva({
  base: "bg-ui-bg-switch-off hover:bg-ui-bg-switch-off-hover data-[state=unchecked]:hover:after:bg-switch-off-hover-gradient before:shadow-details-switch-background focus-visible:shadow-details-switch-background-focus data-[state=checked]:bg-ui-bg-interactive disabled:opacity-50 group relative inline-flex items-center rounded-full outline-none transition-all before:absolute before:inset-0 before:rounded-full before:content-[''] after:absolute after:inset-0 after:rounded-full after:content-[''] disabled:cursor-not-allowed",
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
  base: "bg-ui-fg-on-color shadow-details-switch-handle pointer-events-none h-[14px] w-[14px] rounded-full transition-all",
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
  extends
    Omit<React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>, "asChild">,
    VariantProps<typeof switchVariants> {}

/**
 * This component is based on the [Radix UI Switch](https://www.radix-ui.com/primitives/docs/components/switch) primitive.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(
  (
    {
      className,
      /**
       * The switch's size.
       */
      size = "base",
      ...props
    }: SwitchProps,
    ref
  ) => (
    <RadixSwitch.Root
      className={clx(switchVariants({ size }), className)}
      {...props}
      ref={ref}
    >
      <RadixSwitch.Thumb className={clx(thumbVariants({ size }))} />
    </RadixSwitch.Root>
  )
)
Switch.displayName = "Switch"

export { Switch }
