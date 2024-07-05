import React from "react"
import { Badge, LegacyLink, Tooltip } from "@/components"

export type FeatureFlagNoticeProps = {
  featureFlag: string
  type?: "endpoint" | "type"
  tooltipTextClassName?: string
  badgeClassName?: string
  badgeContent?: React.ReactNode
}

export const FeatureFlagNotice = ({
  featureFlag,
  type = "endpoint",
  tooltipTextClassName,
  badgeClassName,
  badgeContent = "feature flag",
}: FeatureFlagNoticeProps) => {
  return (
    <Tooltip
      tooltipChildren={
        <span className={tooltipTextClassName}>
          To use this {type}, make sure to
          <br />
          {/* TODO replace with Link once we move away from Docusaurus */}
          <LegacyLink
            href="https://docs.medusajs.com/development/feature-flags/toggle"
            target="__blank"
          >
            enable its feature flag: <code>{featureFlag}</code>
          </LegacyLink>
        </span>
      }
      clickable
    >
      <Badge variant="green" className={badgeClassName}>
        {badgeContent}
      </Badge>
    </Tooltip>
  )
}
