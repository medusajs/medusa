import React from "react"
import { Badge, LegacyLink, Tooltip } from "@/components"

export type ExpandableNoticeProps = {
  type: "request" | "method"
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
          {type === "request" ? "parameter" : "property or option"},
          {/* TODO replace with Link once we move away from Docusaurus */}
          <br /> this field can be <LegacyLink href={link}>
            expanded
          </LegacyLink>{" "}
          into an object.
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
