import { cva, type VariantProps } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

const headingVariants = cva({
  base: "font-sans font-medium",
  variants: {
    level: {
      h1: "h1-core",
      h2: "h2-core",
      h3: "h3-core",
    },
  },
  defaultVariants: {
    level: "h1",
  },
})

/**
 * @prop level - The heading level which specifies which heading element is used.
 */
interface HeadingProps extends VariantProps<typeof headingVariants>,
  React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * This component is based on the heading element (`h1`, `h2`, etc...) depeneding on the specified level
 * and supports all props of this element.
 */
const Heading = ({ level = "h1", className, ...props }: HeadingProps) => {
  const Component = level || "h1"

  return (
    <Component
      className={clx(headingVariants({ level }), className)}
      {...props}
    />
  )
}

export { Heading, headingVariants }
