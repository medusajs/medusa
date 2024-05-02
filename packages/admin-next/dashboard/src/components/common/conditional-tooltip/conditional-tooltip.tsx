import { Tooltip } from "@medusajs/ui"
import { PropsWithChildren, ReactNode } from "react"

type ConditionalTooltipProps = PropsWithChildren<{
  content: ReactNode
  showTooltip?: boolean
}>

export const ConditionalTooltip = ({
  children,
  content,
  showTooltip = false,
}: ConditionalTooltipProps) => {
  if (showTooltip) {
    return <Tooltip content={content}>{children}</Tooltip>
  }

  return children
}
