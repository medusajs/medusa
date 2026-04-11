import React from "react"
import MDXContentClient from "@/components/MDXContent/Client"
import type { OpenAPI } from "types"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { Fragment } from "react"
import { Link, type InlineCodeProps, capitalize } from "docs-ui"

const InlineCode = dynamic<InlineCodeProps>(
  async () => (await import("docs-ui")).InlineCode
) as React.FC<InlineCodeProps>

export type TagOperationParametersDescriptionProps = {
  schema: OpenAPI.SchemaObject
}

const TagOperationParametersDescription = ({
  schema,
}: TagOperationParametersDescriptionProps) => {
  return (
    <div className={clsx("pb-0.5 flex flex-col gap-0.25")}>
      {schema.default !== undefined && (
        <span data-testid="default">
          Default:{" "}
          <InlineCode className="break-words">
            {JSON.stringify(schema.default)}
          </InlineCode>
        </span>
      )}
      {schema.enum && (
        <span data-testid="enum">
          Enum:{" "}
          {schema.enum.map((value, index) => (
            <Fragment key={index}>
              {index !== 0 && <>, </>}
              <InlineCode key={index}>{JSON.stringify(value)}</InlineCode>
            </Fragment>
          ))}
        </span>
      )}
      {schema.example !== undefined && (
        <span data-testid="example">
          Example:{" "}
          <InlineCode className="break-words">
            {JSON.stringify(schema.example)}
          </InlineCode>
        </span>
      )}
      {schema.description && (
        <>
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
        <span data-testid="related-guide">
          Related guide:{" "}
          <Link
            href={schema.externalDocs.url}
            target="_blank"
            variant="content"
          >
            {schema.externalDocs.description || "Read More"}
          </Link>
        </span>
      )}
    </div>
  )
}

export default TagOperationParametersDescription
