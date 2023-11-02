import { DetailsSummary, InlineCode, MarkdownContent } from "docs-ui"
import React from "react"
import Details from "../../../theme/Details"
import clsx from "clsx"
import { Parameter } from ".."

type ParameterTypesItemsProps = {
  parameters: Parameter[]
  level?: number
}

const ParameterTypesItems = ({
  parameters,
  level = 1,
}: ParameterTypesItemsProps) => {
  function getItemClassNames(details = true) {
    return clsx(
      level < 3 && [
        "odd:[&:not(:first-child):not(:last-child)]:!border-y last:not(:first-child):!border-t",
        "first:!border-t-0 first:not(:last-child):!border-b last:!border-b-0 even:!border-y-0",
      ],
      details && level == 1 && `group/parameter`,
      !details &&
        level == 1 &&
        `group-open/parameter:border-solid group-open/parameter:border-0 group-open/parameter:border-b`,
      level >= 3 && "!border-0"
    )
  }
  function getSummary(parameter: Parameter, key: number, nested = true) {
    return (
      <DetailsSummary
        subtitle={
          parameter.description || parameter.defaultValue ? (
            <>
              <MarkdownContent
                allowedElements={["a", "strong", "code"]}
                unwrapDisallowed={true}
                className="text-medium"
              >
                {parameter.description}
              </MarkdownContent>
              {parameter.defaultValue && (
                <p className="mt-0.5 mb-0">
                  Default: <InlineCode>{parameter.defaultValue}</InlineCode>
                </p>
              )}
            </>
          ) : undefined
        }
        expandable={parameter.children?.length > 0}
        className={clsx(
          getItemClassNames(false),
          level < 3 && "!p-1",
          !nested && "cursor-default",
          level >= 3 && [
            "pl-1 mt-1",
            "mx-1 relative before:content-[''] before:h-full before:w-0.25",
            "before:absolute before:top-0 before:left-0",
            "before:bg-medusa-fg-muted before:rounded-full",
          ]
        )}
        onClick={(e) => {
          const targetElm = e.target as HTMLElement
          if (targetElm.tagName.toLowerCase() === "a") {
            window.location.href =
              targetElm.getAttribute("href") || window.location.href
            return
          }
        }}
      >
        <div className="flex gap-0.75">
          <InlineCode>{parameter.name}</InlineCode>
          <span className="font-monospace text-compact-small-plus text-medusa-fg-subtle">
            <MarkdownContent allowedElements={["a"]} unwrapDisallowed={true}>
              {parameter.type}
            </MarkdownContent>
          </span>
          {parameter.optional === false && (
            <span
              className={clsx(
                "text-compact-x-small-plus uppercase",
                "text-medusa-fg-error"
              )}
            >
              Required
            </span>
          )}
        </div>
      </DetailsSummary>
    )
  }

  return (
    <div
      className={clsx(
        level > 1 && "bg-docs-bg-surface rounded",
        level >= 3 && "mb-1"
      )}
    >
      {parameters.map((parameter, key) => {
        return (
          <>
            {parameter.children?.length > 0 && (
              <Details
                summary={getSummary(parameter, key)}
                key={key}
                className={clsx(getItemClassNames())}
                heightAnimation={true}
              >
                {parameter.children && (
                  <ParameterTypesItems
                    parameters={parameter.children}
                    level={level + 1}
                  />
                )}
              </Details>
            )}
            {(parameter.children?.length || 0) === 0 &&
              getSummary(parameter, key, false)}
          </>
        )
      })}
    </div>
  )
}

export default ParameterTypesItems
