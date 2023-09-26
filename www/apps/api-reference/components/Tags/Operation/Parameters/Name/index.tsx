import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { TooltipProps } from "docs-ui"
import type { TagsOperationFeatureFlagNoticeProps } from "../../FeatureFlagNotice"
import { Badge, NextLink } from "docs-ui"

const Tooltip = dynamic<TooltipProps>(
  async () => (await import("docs-ui")).Tooltip
) as React.FC<TooltipProps>

const TagsOperationFeatureFlagNotice =
  dynamic<TagsOperationFeatureFlagNoticeProps>(
    async () => import("../../FeatureFlagNotice")
  ) as React.FC<TagsOperationFeatureFlagNoticeProps>

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
                <NextLink href="#expanding-fields">expanded</NextLink> into an
                object.
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
