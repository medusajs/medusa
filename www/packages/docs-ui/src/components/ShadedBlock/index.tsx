import { clsx } from "clsx"
import React from "react"

type ShadedBlockProps = {
  className?: string
}

export const ShadedBlock = ({ className }: ShadedBlockProps) => {
  return (
    <div
      className={clsx(
        "bg-repeat",
        "h-full w-auto",
        "bg-bg-stripes dark:bg-bg-stripes-dark dark:opacity-20",
        className
      )}
    />
  )
}
