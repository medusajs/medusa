import React from "react"
import Link from "next/link"
import clsx from "clsx"
import { ArrowUpRightOnBox } from "@medusajs/icons"

type EditButtonProps = {
  filePath: string
}

export const EditButton = ({ filePath }: EditButtonProps) => {
  return (
    <Link
      href={`https://github.com/medusajs/medusa/edit/develop${filePath}`}
      className={clsx(
        "flex w-fit gap-docs_0.25 my-docs_2 items-center",
        "text-medusa-fg-muted hover:text-medusa-fg-subtle",
        "text-compact-small-plus"
      )}
    >
      <span>Edit this page</span>
      <ArrowUpRightOnBox />
    </Link>
  )
}
