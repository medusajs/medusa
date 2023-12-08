"use client"

import * as Primitives from "@radix-ui/react-label"
import { cva, type VariantProps } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

const labelVariants = cva({
  base: "font-sans",
  variants: {
    size: {
      xsmall: "txt-compact-xsmall",
      small: "txt-compact-small",
      base: "txt-compact-medium",
      large: "txt-compact-large",
    },
    weight: {
      regular: "font-normal",
      plus: "font-medium",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "regular",
  },
})

/**
 * @prop size - The label's size.
 * @prop weight - The label's font weight.
 */
interface LabelProps
  extends React.ComponentPropsWithoutRef<"label">,
    VariantProps<typeof labelVariants> {}

/**
 * This component is based on the [Radix UI Label](https://www.radix-ui.com/primitives/docs/components/label) primitive.
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size = "base", weight = "regular", ...props }: LabelProps, ref) => {
    return (
      <Primitives.Root
        ref={ref}
        className={clx(labelVariants({ size, weight }), className)}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
