import React from "react"
import type { OpenAPI } from "types"
import { Badge, ExpandableNotice, FeatureFlagNotice } from "docs-ui"
import { Fragment } from "react"

export type TagOperationParametersNameProps = {
  name: string
  isRequired?: boolean
  schema: OpenAPI.SchemaObject
}

const TagOperationParametersName = ({
  name,
  isRequired,
  schema,
}: TagOperationParametersNameProps) => {
  let typeDescription: React.ReactNode = <></>
  switch (true) {
    case schema.type === "object":
      typeDescription = (
        <>
          {schema.type} {schema.title ? `(${schema.title})` : ""}
          {schema.nullable ? ` or null` : ""}
        </>
      )
      break
    case schema.type === "array":
      typeDescription = (
        <>
          {formatArrayDescription((schema as OpenAPI.ArraySchemaObject).items)}
          {schema.nullable ? ` or null` : ""}
        </>
      )
      break
    case schema.anyOf !== undefined:
    case schema.allOf !== undefined:
      typeDescription = (
        <>
          {formatUnionDescription(schema.allOf || schema.anyOf)}
          {schema.nullable ? ` or null` : ""}
        </>
      )
      break
    case schema.oneOf !== undefined:
      typeDescription = (
        <>
          {schema.oneOf!.map((item, index) => (
            <Fragment key={index}>
              {index !== 0 && <> or </>}
              {item.type !== "array" && <>{item.title || item.type}</>}
              {item.type === "array" && (
                <>array{item.items.type ? ` of ${item.items.type}s` : ""}</>
              )}
            </Fragment>
          ))}
          {schema.nullable ? ` or null` : ""}
        </>
      )
      break
    default:
      typeDescription = (
        <>
          {!schema.type ? "any" : schema.type}
          {schema.format ? ` <${schema.format}>` : ""}
          {schema.nullable ? ` or null` : ""}
        </>
      )
  }

  return (
    <span className="inline-flex gap-0.5 items-center">
      <span className="font-monospace" data-testid="name">
        {name}
      </span>
      <span
        className="text-medusa-fg-muted text-compact-small"
        data-testid="type-description"
      >
        {typeDescription}
      </span>
      {schema.deprecated && (
        <Badge variant="orange" className="ml-1">
          deprecated
        </Badge>
      )}
      {schema["x-expandable"] && (
        <ExpandableNotice type="request" link="#expanding-relations" />
      )}
      {schema["x-featureFlag"] && (
        <FeatureFlagNotice featureFlag={schema["x-featureFlag"]} type="type" />
      )}
      {!isRequired && (
        <span
          className="text-medusa-tag-blue-text text-compact-x-small"
          data-testid="optional"
        >
          optional
        </span>
      )}
    </span>
  )
}

export default TagOperationParametersName

function formatArrayDescription(schema?: OpenAPI.SchemaObject) {
  if (!schema) {
    return "Array"
  }

  const type =
    schema.type === "object"
      ? `objects ${schema.title ? `(${schema.title})` : ""}`
      : `${schema.type || "object"}s`

  return `Array of ${type}`
}

function formatUnionDescription(arr?: OpenAPI.SchemaObject[]) {
  const types = [...new Set(arr?.map((type) => type.type || "object"))]
  return <>{types.join(" or ")}</>
}
