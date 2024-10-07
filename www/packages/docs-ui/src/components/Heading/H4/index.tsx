import clsx from "clsx"
import React from "react"

export const H4 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h4
      className={clsx("mb-docs_0.5 text-medusa-fg-base text-h4", className)}
      {...props}
    />
  )
}
