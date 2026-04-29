"use client"

import clsx from "clsx"
import React from "react"
import { CopyButton } from "@/components/CopyButton"
import { Link } from "@/components/Link"
import { useHeadingUrl } from "../../../hooks/use-heading-url"
import { useLayout } from "../../../providers/Layout"

export type H2Props = React.HTMLAttributes<HTMLHeadingElement> & {
  id?: string
  passRef?: React.RefObject<HTMLHeadingElement | null>
}

export const H2 = ({ className, children, passRef, ...props }: H2Props) => {
  const { showCollapsedNavbar } = useLayout()

  const copyText = useHeadingUrl({
    id: props.id || "",
  })
  return (
    <h2
      className={clsx(
        "text-h2 [&>code]:!text-h2 [&>code]:!font-mono mb-docs_1 mt-docs_2 text-medusa-fg-base",
        props.id && [
          "group/h2",
          showCollapsedNavbar && "scroll-m-docs_7",
          !showCollapsedNavbar && "scroll-m-56",
        ],
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
          <Link href={`#${props.id}`} scroll={false} prefetch={false}>
            #
          </Link>
        </CopyButton>
      )}
    </h2>
  )
}
