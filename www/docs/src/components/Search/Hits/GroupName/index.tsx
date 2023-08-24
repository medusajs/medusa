import React from "react"
import clsx from "clsx"

type SearchHitGroupNameProps = {
  name: string
}

const SearchHitGroupName = ({ name }: SearchHitGroupNameProps) => {
  return (
    <span
      className={clsx(
        "pb-0.25 flex px-0.5 pt-1",
        "text-medusa-fg-muted dark:text-medusa-fg-muted-dark",
        "text-compact-x-small-plus"
      )}
    >
      {name}
    </span>
  )
}

export default SearchHitGroupName
