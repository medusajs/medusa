import React from "react"
import { Badge, Tooltip } from "../.."

type BetaBadgeProps = {
  text?: string
  tooltipText?: string
}

export const BetaBadge = ({
  text = "Coming soon",
  tooltipText = "Coming soon",
}: BetaBadgeProps) => {
  return (
    <Tooltip
      tooltipChildren={tooltipText}
      className="align-middle text-compact-x-small-plus"
    >
      <Badge variant="blue" badgeType="shaded" className="cursor-pointer">
        {text}
      </Badge>
    </Tooltip>
  )
}
