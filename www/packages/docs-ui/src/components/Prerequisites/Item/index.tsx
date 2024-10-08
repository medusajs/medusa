import clsx from "clsx"
import Link from "next/link"
import React from "react"

export type PrerequisiteItemPosition = "top" | "middle" | "bottom" | "alone"

export type PrerequisiteItemType = {
  text: string
  link?: string
  position?: PrerequisiteItemPosition
}

type PrerequisiteItemProps = {
  item: PrerequisiteItemType
}

export const PrerequisiteItem = ({
  item: { text, link, position = "alone" },
}: PrerequisiteItemProps) => {
  return (
    <Link
      href={link || "#"}
      className={clsx(
        "bg-medusa-tag-neutral-bg text-medusa-fg-subtle",
        "px-docs_0.75 py-docs_0.5 w-fit",
        "flex justify-center items-center",
        link && "hover:bg-medusa-tag-neutral-bg-hover",
        "rounded-tr-docs_xl rounded-br-docs_xl",
        position === "alone" && "rounded-docs_xl",
        position === "top" && "rounded-tl-docs_xl rounded-bl-docs_DEFAULT",
        position === "middle" &&
          "rounded-tl-docs_DEFAULT rounded-bl-docs_DEFAULT",
        position === "bottom" && "rounded-tl-docs_DEFAULT rounded-bl-docs_xl",
        !link && "cursor-text"
      )}
    >
      {text}
      {link && "↗"}
    </Link>
  )
}
