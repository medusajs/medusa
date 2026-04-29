import React from "react"
import clsx from "clsx"

type SectionDividerProps = {
  className?: string
}

const SectionDivider = ({ className }: SectionDividerProps) => {
  return (
    <hr
      className={clsx("absolute bottom-0 z-0 m-0 w-screen left-0", className)}
    />
  )
}

export default SectionDivider
