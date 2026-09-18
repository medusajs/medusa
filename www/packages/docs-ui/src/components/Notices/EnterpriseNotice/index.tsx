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
  beta?: boolean
  betaBadgeContent?: React.ReactNode
}

export const EnterpriseNotice = ({
  featureName = "feature",
  featureFlag,
  tooltipTextClassName,
  badgeClassName,
  badgeContent = "Enterprise",
  featureFlagHref = "https://docs.medusajs.com/learn/debugging-and-testing/feature-flags",
  beta = false,
  betaBadgeContent = "Beta",
}: EnterpriseNoticeProps) => {
  return (
    <span className="my-docs_0.5 flex gap-docs_0.25">
      <Tooltip
        tooltipChildren={
          <span className={tooltipTextClassName}>
            This {featureName} requires an{" "}
            <Link href="https://docs.medusajs.com/resources/enterprise">
              enterprise license
            </Link>
            .
            <br />
            {featureFlag && (
              <>
                {" "}
                You must also{" "}
                <Link href={featureFlagHref}>
                  enable its feature flag
                </Link>: <code>{featureFlag}</code>.
              </>
            )}
          </span>
        }
        clickable
        className="flex"
      >
        <Badge variant="purple" className={badgeClassName}>
          {badgeContent}
        </Badge>
      </Tooltip>
      {beta && (
        <Tooltip
          tooltipChildren={
            <span className={tooltipTextClassName}>
              This {featureName} is in beta. Its API and behavior may change in
              future releases.
            </span>
          }
          clickable
          className="flex"
        >
          <Badge variant="blue" className={badgeClassName}>
            {betaBadgeContent}
          </Badge>
        </Tooltip>
      )}
    </span>
  )
}
