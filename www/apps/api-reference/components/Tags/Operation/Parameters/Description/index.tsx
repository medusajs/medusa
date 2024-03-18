import MDXContentClient from "@/components/MDXContent/Client"
import type { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { Fragment } from "react"
import { Link, type InlineCodeProps, capitalize } from "docs-ui"

const InlineCode = dynamic<InlineCodeProps>(
  async () => (await import("docs-ui")).InlineCode
) as React.FC<InlineCodeProps>

type TagOperationParametersDescriptionProps = {
  schema: SchemaObject
}

const TagOperationParametersDescription = ({
  schema,
}: TagOperationParametersDescriptionProps) => {
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
          {schema.type === "array" && formatArrayDescription(schema.items)}
          {schema.nullable ? ` or null` : ""}
        </>
      )
      break
    case schema.anyOf !== undefined:
    case schema.allOf !== undefined:
      typeDescription = (
        <>
          {formatUnionDescription(schema.allOf)}
          {schema.nullable ? ` or null` : ""}
        </>
      )
      break
    case schema.oneOf !== undefined:
      typeDescription = (
        <>
          {schema.oneOf?.map((item, index) => (
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
          {schema.type}
          {schema.nullable ? ` or null` : ""}
          {schema.format ? ` <${schema.format}>` : ""}
        </>
      )
  }
  return (
    <div className={clsx("w-2/3 break-words pb-0.5")}>
      {typeDescription}
      {schema.default !== undefined && (
        <>
          <br />
          <span>
            Default:{" "}
            <InlineCode className="break-words">
              {JSON.stringify(schema.default)}
            </InlineCode>
          </span>
        </>
      )}
      {schema.enum && (
        <>
          <br />
          <span>
            Enum:{" "}
            {schema.enum.map((value, index) => (
              <Fragment key={index}>
                {index !== 0 && <>, </>}
                <InlineCode key={index}>{JSON.stringify(value)}</InlineCode>
              </Fragment>
            ))}
          </span>
        </>
      )}
      {schema.example !== undefined && (
        <>
          <br />
          <span>
            Example:{" "}
            <InlineCode className="break-words">
              {JSON.stringify(schema.example)}
            </InlineCode>
          </span>
        </>
      )}
      {schema.description && (
        <>
          <br />
          <MDXContentClient
            content={capitalize(schema.description)}
            className={clsx("!mb-0 [&>*]:!mb-0")}
            scope={{
              addToSidebar: false,
            }}
          />
        </>
      )}
      {schema.externalDocs && (
        <>
          Related guide:{" "}
          <Link href={schema.externalDocs.url} target="_blank">
            {schema.externalDocs.description || "Read More"}
          </Link>
        </>
      )}
    </div>
  )
}

export default TagOperationParametersDescription

function formatArrayDescription(schema?: SchemaObject) {
  if (!schema) {
    return "Array"
  }

  const type =
    schema.type === "object"
      ? `objects ${schema.title ? `(${schema.title})` : ""}`
      : `${schema.type || "object"}s`

  return `Array of ${type}`
}

function formatUnionDescription(arr?: SchemaObject[]) {
  const types = [...new Set(arr?.map((type) => type.type || "object"))]
  return <>{types.join(" or ")}</>
}
