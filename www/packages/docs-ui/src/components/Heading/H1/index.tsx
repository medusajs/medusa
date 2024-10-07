import clsx from "clsx"
import React from "react"

type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
  id?: string
}

export const H1 = ({ className, ...props }: H1Props) => {
  return (
    <h1
      className={clsx(
        "h1-docs [&_code]:!h1-docs [&_code]:!font-mono mb-docs_1 text-medusa-fg-base",
        props.id && "scroll-m-56",
        className
      )}
      {...props}
    />
  )
}
