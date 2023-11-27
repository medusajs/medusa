import { SparklesSolid } from "@medusajs/icons"
import clsx from "clsx"
import React from "react"

export type AiAssistantCommandIconProps =
  React.AllHTMLAttributes<HTMLSpanElement>

export const AiAssistantCommandIcon = ({
  className,
  ...props
}: AiAssistantCommandIconProps) => {
  return (
    <span
      className={clsx(
        "bg-button-inverted bg-medusa-button-inverted dark:bg-button-inverted-dark",
        "rounded-md p-[2px] text-medusa-fg-on-inverted flex",
        className
      )}
      {...props}
    >
      <SparklesSolid />
    </span>
  )
}
