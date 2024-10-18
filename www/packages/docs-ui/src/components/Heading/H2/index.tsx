"use client"

import clsx from "clsx"
import React, { useMemo } from "react"
import { CopyButton, Link } from "@/components"
import { useIsBrowser } from "../../../providers"

type H2Props = React.HTMLAttributes<HTMLHeadingElement> & {
  id?: string
  passRef?: React.RefObject<HTMLHeadingElement>
}

export const H2 = ({ className, children, passRef, ...props }: H2Props) => {
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
    <h2
      className={clsx(
        "h2-docs [&_code]:!h2-docs [&_code]:!font-mono mb-docs_1 mt-docs_4 text-medusa-fg-base",
        props.id && "group/h2 scroll-m-56",
        className
      )}
      {...props}
      ref={passRef}
    >
      {children}
      {props.id && (
        <CopyButton
          text={copyText}
          className="opacity-0 group-hover/h2:opacity-100 transition-opacity ml-docs_0.5 inline-block"
        >
          <Link href={`#${props.id}`} scroll={false}>
            #
          </Link>
        </CopyButton>
      )}
    </h2>
  )
}
