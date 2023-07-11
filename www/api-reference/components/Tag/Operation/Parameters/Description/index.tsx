import { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import { ReactNode } from "react"

type TagOperationParametersDescriptionProps = {
  schema: SchemaObject
}

const TagOperationParametersDescription = ({
  schema,
}: TagOperationParametersDescriptionProps) => {
  let typeDescription: ReactNode = <></>
  switch (true) {
    case schema.type === "object":
      typeDescription = (
        <>
          {schema.type} ({schema.title})
        </>
      )
      break
    case schema.type === "array":
      typeDescription = (
        <>{schema.type === "array" && formatArrayDescription(schema.items)}</>
      )
      break
    case schema.anyOf !== undefined:
    case schema.allOf !== undefined:
      typeDescription = <>{formatUnionDescription(schema.allOf)}</>
      break
    default:
      typeDescription = <>{schema.type}</>
  }
  return (
    <span
      className={clsx(
        "w-2/3 pb-0.5",
        "border-medusa-border-base dark:border-medusa-border-base-dark border-b border-solid"
      )}
    >
      {typeDescription}
      {schema.description && (
        <>
          <br />
          <span>{schema.description}</span>
        </>
      )}
    </span>
  )
}

export default TagOperationParametersDescription

function formatArrayDescription(schema: SchemaObject) {
  const type =
    schema.type === "object"
      ? `objects ${schema.title ? `(${schema.title})` : ""}`
      : `${schema.type}s`

  return `Array of ${type}`
}

function formatUnionDescription(arr?: SchemaObject[]) {
  const types = [...new Set(arr?.map((type) => type.type))]
  return <>{types.join(" or ")}</>
}
