"use client"

import React from "react"
import Link from "next/link"
import clsx from "clsx"
import { MarkdownSolid } from "@medusajs/icons"

export type ViewAsMarkdownProps = {
  /**
   * The page path (without basePath), e.g. `/store/carts/get-a-cart`.
   * `next/link` prepends the app's `basePath` (`/api`) automatically.
   */
  path: string
  className?: string
}

/**
 * A "View as Markdown" link that opens the current section's Markdown (`.md`),
 * mirroring the other docs apps' `ContentMenuActions`.
 */
const ViewAsMarkdown = ({ path, className }: ViewAsMarkdownProps) => {
  return (
    <Link
      href={`${path}.md`}
      className={clsx(
        "flex w-fit items-center gap-docs_0.5 text-medusa-fg-subtle text-x-small-plus hover:text-medusa-fg-base",
        className
      )}
      data-testid="markdown-link"
    >
      <MarkdownSolid width={15} height={15} />
      View as Markdown
    </Link>
  )
}

export default ViewAsMarkdown
