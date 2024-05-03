import { Badge, Link, Tooltip } from "docs-ui"

export type TagsOperationFeatureFlagNoticeProps = {
  featureFlag: string
  type?: "endpoint" | "parameter"
  tooltipTextClassName?: string
  badgeClassName?: string
}

const TagsOperationFeatureFlagNotice = ({
  featureFlag,
  type = "endpoint",
  tooltipTextClassName,
  badgeClassName,
}: TagsOperationFeatureFlagNoticeProps) => {
  return (
    <Tooltip
      tooltipChildren={
        <span className={tooltipTextClassName}>
          To use this {type}, make sure to
          <br />
          <Link
            href="https://docs.medusajs.com/development/feature-flags/toggle"
            target="__blank"
          >
            enable its feature flag: <code>{featureFlag}</code>
          </Link>
        </span>
      }
      clickable
    >
      <Badge variant="green" className={badgeClassName}>
        feature flag
      </Badge>
    </Tooltip>
  )
}

export default TagsOperationFeatureFlagNotice
