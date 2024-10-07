import clsx from "clsx"
import React from "react"
import { Link } from "@/components"

type H3Props = React.HTMLAttributes<HTMLHeadingElement> & {
  id?: string
}

export const H3 = ({ className, children, ...props }: H3Props) => {
  return (
    <h3
      className={clsx(
        "h3-docs [&_code]:!h3-docs [&_code]:!font-mono mb-docs_0.5 mt-docs_3 text-medusa-fg-base",
        props.id && "group/h3 scroll-m-56",
        className
      )}
      {...props}
    >
      {children}
      {props.id && (
        <Link
          href={`#${props.id}`}
          className="opacity-0 group-hover/h3:opacity-100 transition-opacity ml-docs_0.5 inline-block"
        >
          #
        </Link>
      )}
    </h3>
  )
}
