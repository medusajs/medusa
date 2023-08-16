import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { BadgeProps } from "../../../../Badge"
import type { TooltipProps } from "../../../../Tooltip"
import type { TagsOperationFeatureFlagNoticeProps } from "../../FeatureFlagNotice"
import { LinkProps } from "../../../../MDXComponents/Link"

const Badge = dynamic<BadgeProps>(
  async () => import("../../../../Badge")
) as React.FC<BadgeProps>

const Tooltip = dynamic<TooltipProps>(
  async () => import("../../../../Tooltip")
) as React.FC<TooltipProps>

const TagsOperationFeatureFlagNotice =
  dynamic<TagsOperationFeatureFlagNoticeProps>(
    async () => import("../../FeatureFlagNotice")
  ) as React.FC<TagsOperationFeatureFlagNoticeProps>

const Link = dynamic<LinkProps>(
  async () => import("../../../../MDXComponents/Link")
) as React.FC<LinkProps>

export type TagOperationParametersNameProps = {
  name: string
  isRequired?: boolean
  schema: SchemaObject
}

const TagOperationParametersName = ({
  name,
  isRequired,
  schema,
}: TagOperationParametersNameProps) => {
  return (
    <span className="w-1/3 break-words pr-0.5">
      <span className="font-monospace">{name}</span>
      {schema.deprecated && (
        <Badge variant="orange" className="ml-1">
          deprecated
        </Badge>
      )}
      {schema["x-expandable"] && (
        <>
          <br />
          <Tooltip
            tooltipChildren={
              <>
                If this request accepts an <code>expand</code> parameter,
                <br /> this field can be{" "}
                <Link href="#expanding-fields">expanded</Link> into an object.
              </>
            }
            clickable
          >
            <Badge variant="blue">expandable</Badge>
          </Tooltip>
        </>
      )}
      {schema["x-featureFlag"] && (
        <>
          <br />
          <TagsOperationFeatureFlagNotice
            featureFlag={schema["x-featureFlag"]}
            type="parameter"
          />
        </>
      )}
      {isRequired && (
        <>
          <br />
          <span className="text-medusa-tag-red-text text-compact-x-small">
            required
          </span>
        </>
      )}
    </span>
  )
}

export default TagOperationParametersName
