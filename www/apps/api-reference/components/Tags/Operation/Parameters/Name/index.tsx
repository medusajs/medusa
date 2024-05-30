import type { SchemaObject } from "@/types/openapi"
import { Badge, ExpandableNotice, FeatureFlagNotice } from "docs-ui"

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
          <ExpandableNotice type="request" link="#expanding-relations" />
        </>
      )}
      {schema["x-featureFlag"] && (
        <>
          <br />
          <FeatureFlagNotice
            featureFlag={schema["x-featureFlag"]}
            type="type"
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
