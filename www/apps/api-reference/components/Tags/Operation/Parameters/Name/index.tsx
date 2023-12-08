import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { TooltipProps } from "docs-ui"
import { Badge, ExpandableNotice, FeatureFlagNotice, NextLink } from "docs-ui"

const Tooltip = dynamic<TooltipProps>(
  async () => (await import("docs-ui")).Tooltip
) as React.FC<TooltipProps>

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
          <ExpandableNotice type="request" link="#expanding-fields" />
        </>
      )}
      {schema["x-featureFlag"] && (
        <>
          <br />
          <FeatureFlagNotice
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
