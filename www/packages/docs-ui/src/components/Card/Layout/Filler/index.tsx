import React from "react"
import { CardProps } from "../../../.."
import clsx from "clsx"
import Link from "next/link"

export const CardFillerLayout = ({ text, href, className }: CardProps) => {
  return (
    <div
      className={clsx(
        "flex justify-center items-center w-full",
        "gap-docs_0.75 px-docs_0.75 py-docs_0.5 rounded-docs_DEFAULT",
        "border border-dashed border-medusa-border-strong",
        "bg-medusa-bg-component text-medusa-fg-subtle",
        className
      )}
    >
      <div>
        <span className="text-compact-small">{text}</span>
        {href && (
          <>
            {" "}
            <Link href={href} className="text-compact-small-plus">
              Show All↗
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
