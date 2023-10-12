import { Badge, DetailsSummary, InlineCode, MarkdownContent } from "docs-ui"
import React from "react"
import Details from "../../theme/Details"
import clsx from "clsx"

type Parameter = {
  name: string
  type: string
  optional?: boolean
  defaultValue?: string
  description?: string
  children?: Parameter[]
}

type ParameterTypesProps = {
  title?: string
  parameters: Parameter[]
  level?: number
}

const ParameterTypes = ({
  title,
  parameters,
  level = 1,
}: ParameterTypesProps) => {
  const paddingStyling = {
    padding: `${8 * level}px`,
  }
  function getSummary(parameter: Parameter, nested = true) {
    return (
      <DetailsSummary
        subtitle={
          <>
            <MarkdownContent
              allowedElements={["a", "strong", "code"]}
              unwrapDisallowed={true}
            >
              {parameter.description}
            </MarkdownContent>
            {parameter.defaultValue && (
              <p className="mt-0.5 mb-0">
                Default: <InlineCode>{parameter.defaultValue}</InlineCode>
              </p>
            )}
          </>
        }
        badge={
          !parameter.optional ? (
            <Badge variant="red">Required</Badge>
          ) : undefined
        }
        expandable={parameter.children.length > 0}
        className={clsx(
          "odd:[&:not(:first-child):not(:last-child)]:!border-y last:!border-t first:!border-t-0 first:!border-b last:!border-b-0 even:!border-y-0",
          !nested && "cursor-default"
        )}
        style={!nested ? paddingStyling : {}}
      >
        <InlineCode>{parameter.name}</InlineCode>
        <span className="font-monospace text-compact-x-small ml-1 text-medusa-fg-subtle">
          <MarkdownContent allowedElements={["a"]} unwrapDisallowed={true}>
            {parameter.type}
          </MarkdownContent>
        </span>
      </DetailsSummary>
    )
  }
  function getContent() {
    return (
      <>
        {parameters.map((parameter, key) => {
          return (
            <>
              {parameter.children.length > 0 && (
                <Details
                  summary={getSummary(parameter)}
                  key={key}
                  className={clsx(
                    "odd:[&:not(:first-child):not(:last-child)]:!border-y last:!border-t first:!border-t-0 first:!border-b last:!border-b-0 even:!border-y-0"
                  )}
                  style={paddingStyling}
                >
                  {parameter.children && (
                    <ParameterTypes
                      parameters={parameter.children}
                      level={level + 1}
                    />
                  )}
                </Details>
              )}
              {parameter.children.length === 0 && getSummary(parameter, false)}
            </>
          )
        })}
      </>
    )
  }
  return (
    <div
      className={clsx(
        "border border-solid border-medusa-border-base rounded",
        level > 1 && "bg-docs-bg-surface"
      )}
    >
      {title && (
        <Details
          summary={title}
          className={clsx(
            "first:!border-t-0 last:!border-b-0",
            parameters.length <= 2 && "last:!border-t-0"
          )}
          style={paddingStyling}
        >
          <ParameterTypes parameters={parameters} level={level + 1} />
        </Details>
      )}
      {!title && getContent()}
    </div>
  )
}

export default ParameterTypes
