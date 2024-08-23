import React from "react"
import clsx from "clsx"

export type SearchHitGroupNameProps = {
  name: string
}

export const SearchHitGroupName = ({ name }: SearchHitGroupNameProps) => {
  return (
    <span
      className={clsx(
        "pb-docs_0.25 flex px-docs_0.5 pt-docs_0.75",
        "text-medusa-fg-muted",
        "text-compact-x-small-plus"
      )}
    >
      {name}
    </span>
  )
}
