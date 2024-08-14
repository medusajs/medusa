import React from "react"
import { Badge, Link, Tooltip } from "@/components"

export type ExpandableNoticeProps = {
  type: "request" | "method" | "workflow"
  link: string
  badgeContent?: React.ReactNode
  badgeClassName?: string
}

export const ExpandableNotice = ({
  type = "request",
  link,
  badgeContent = "expandable",
  badgeClassName,
}: ExpandableNoticeProps) => {
  return (
    <Tooltip
      tooltipChildren={
        <>
          If this {type} accepts an <code>expand</code>{" "}
          {type === "request" ? "parameter" : "parameter or property"},
          <br /> this relation can be <Link href={link}>expanded</Link> into an
          object.
        </>
      }
      clickable
    >
      <Badge variant="blue" className={badgeClassName}>
        {badgeContent}
      </Badge>
    </Tooltip>
  )
}
