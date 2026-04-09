import React from "react"
import { Badge } from "@/components/Badge"
import { Tooltip } from "@/components/Tooltip"

export type DeprecatedNoticeProps = {
  description?: string
  tooltipTextClassName?: string
  badgeClassName?: string
  badgeContent?: React.ReactNode
}

export const DeprecatedNotice = ({
  description,
  tooltipTextClassName,
  badgeClassName,
  badgeContent = `Deprecated`,
}: DeprecatedNoticeProps) => {
  return (
    <Tooltip
      tooltipChildren={
        <span className={tooltipTextClassName}>
          {description ||
            "This feature is deprecated and may be removed in future releases."}
        </span>
      }
      clickable
    >
      <Badge variant="neutral" className={badgeClassName}>
        {badgeContent}
      </Badge>
    </Tooltip>
  )
}
