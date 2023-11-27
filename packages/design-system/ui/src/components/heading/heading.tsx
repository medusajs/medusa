import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { clx } from "@/utils/clx"

const headingVariants = cva("font-sans font-medium", {
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

type HeadingProps = VariantProps<typeof headingVariants> &
  React.HTMLAttributes<HTMLHeadingElement>

const Heading = ({ level, className, ...props }: HeadingProps) => {
  const Component = level ? level : "h1"

  return (
    <Component
      className={clx(headingVariants({ level }), className)}
      {...props}
    />
  )
}

export { Heading, headingVariants }
