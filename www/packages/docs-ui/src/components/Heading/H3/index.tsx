"use client"

import clsx from "clsx"
import React, { useMemo } from "react"
import { CopyButton, Link } from "@/components"
import { useIsBrowser } from "../../../providers"

type H3Props = React.HTMLAttributes<HTMLHeadingElement> & {
  id?: string
}

export const H3 = ({ className, children, ...props }: H3Props) => {
  const { isBrowser } = useIsBrowser()
  const copyText = useMemo(() => {
    const url = `#${props.id}`
    if (!isBrowser) {
      return url
    }

    const hashIndex = window.location.href.indexOf("#")
    return (
      window.location.href.substring(
        0,
        hashIndex !== -1 ? hashIndex : window.location.href.length
      ) + url
    )
  }, [props.id, isBrowser])
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
        <CopyButton
          text={copyText}
          className="opacity-0 group-hover/h3:opacity-100 transition-opacity ml-docs_0.5 inline-block"
        >
          <Link href={`#${props.id}`} scroll={false}>
            #
          </Link>
        </CopyButton>
      )}
    </h3>
  )
}
