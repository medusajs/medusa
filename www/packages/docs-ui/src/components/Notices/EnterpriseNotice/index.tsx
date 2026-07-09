import React from "react"
import { Badge } from "@/components/Badge"
import { Tooltip } from "@/components/Tooltip"
import { Link } from "../.."

export type EnterpriseNoticeProps = {
  featureName?: string
  featureFlag?: string
  tooltipTextClassName?: string
  badgeClassName?: string
  badgeContent?: React.ReactNode
  featureFlagHref?: string
}

export const EnterpriseNotice = ({
  featureName = "feature",
  featureFlag,
  tooltipTextClassName,
  badgeClassName,
  badgeContent = "Enterprise",
  featureFlagHref = "https://docs.medusajs.com/learn/debugging-and-testing/feature-flags",
}: EnterpriseNoticeProps) => {
  return (
    <Tooltip
      tooltipChildren={
        <span className={tooltipTextClassName}>
          This {featureName} requires an enterprise license.<br/>
          {featureFlag && (
            <>
              {" "}
              You must also <Link href={featureFlagHref}>enable its feature flag</Link>:{" "}
              <code>{featureFlag}</code>.
            </>
          )}
        </span>
      }
      clickable
      className="my-docs_0.5 flex"
    >
      <Badge variant="purple" className={badgeClassName}>
        {badgeContent}
      </Badge>
    </Tooltip>
  )
}
