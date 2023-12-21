import {
  DetailsSummary,
  ExpandableNotice,
  FeatureFlagNotice,
  InlineCode,
  MarkdownContent,
} from "docs-ui"
import React from "react"
import Details from "../../../theme/Details"
import clsx from "clsx"
import { Parameter } from ".."
import {
  ArrowDownLeftMini,
  ArrowsPointingOutMini,
  TriangleRightMini,
} from "@medusajs/icons"
import IconFlagMini from "../../../theme/Icon/FlagMini"
import decodeStr from "../../../utils/decode-str"

type ParameterTypesItemsProps = {
  parameters: Parameter[]
  level?: number
  expandUrl?: string
}

const ParameterTypesItems = ({
  parameters,
  level = 1,
  expandUrl,
}: ParameterTypesItemsProps) => {
  function getGroupName() {
    switch (level) {
      case 1:
        return "group/parameterOne"
      case 2:
        return "group/parameterTwo"
      case 3:
        return "group/parameterThree"
      case 4:
        return "group/parameterFour"
    }
  }
  function getBorderForGroupName() {
    switch (level) {
      case 1:
        return "group-open/parameterOne:border-solid group-open/parameterOne:border-0 group-open/parameterOne:border-b"
      case 2:
        return "group-open/parameterTwo:border-solid group-open/parameterTwo:border-0 group-open/parameterTwo:border-b"
      case 3:
        return "group-open/parameterThree:border-solid group-open/parameterThree:border-0 group-open/parameterThree:border-b"
      case 4:
        return "group-open/parameterFour:border-solid group-open/parameterFour:border-0 group-open/parameterFour:border-b"
    }
  }
  function getRotateForGroupName() {
    switch (level) {
      case 1:
        return "group-open/parameterOne:rotate-90"
      case 2:
        return "group-open/parameterTwo:rotate-90"
      case 3:
        return "group-open/parameterThree:rotate-90"
      case 4:
        return "group-open/parameterFour:rotate-90"
    }
  }
  function getItemClassNames(details = true) {
    return clsx(
      "odd:[&:not(:first-child):not(:last-child)]:!border-y last:not(:first-child):!border-t",
      "first:!border-t-0 first:not(:last-child):!border-b last:!border-b-0 even:!border-y-0",
      details && getGroupName(),
      !details && getBorderForGroupName()
    )
  }
  function getSummary(parameter: Parameter, nested = true) {
    return (
      <DetailsSummary
        subtitle={
          parameter.description || parameter.defaultValue ? (
            <>
              <MarkdownContent
                allowedElements={["a", "strong", "code", "ul", "ol", "li"]}
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
        hideExpandableIcon={true}
        className={clsx(
          getItemClassNames(false),
          "py-1 pr-1",
          level === 1 && "pl-1",
          level === 2 && "pl-3",
          level === 3 && "pl-[120px]",
          level === 4 && "pl-[160px]",
          !nested && "cursor-default"
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
        <div className="flex gap-0.5">
          {nested && (
            <TriangleRightMini
              className={clsx(
                "text-medusa-fg-subtle transition-transform",
                getRotateForGroupName()
              )}
            />
          )}
          {!nested && level > 1 && (
            <ArrowDownLeftMini
              className={clsx("text-medusa-fg-subtle flip-y")}
            />
          )}
          <div className="flex gap-0.75 flex-wrap">
            <InlineCode>{decodeStr(parameter.name)}</InlineCode>
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
            {parameter.featureFlag && (
              <FeatureFlagNotice
                featureFlag={parameter.featureFlag}
                type="parameter"
                badgeClassName="!p-0 leading-none"
                badgeContent={
                  <IconFlagMini className="!text-medusa-tag-green-text" />
                }
              />
            )}
            {parameter.expandable && (
              <ExpandableNotice
                type="method"
                link={expandUrl || "#"}
                badgeClassName="!p-0 leading-none"
                badgeContent={<ArrowsPointingOutMini />}
              />
            )}
          </div>
        </div>
      </DetailsSummary>
    )
  }

  return (
    <div>
      {parameters.map((parameter, key) => {
        return (
          <>
            {parameter.children?.length > 0 && (
              <Details
                summary={getSummary(parameter)}
                key={key}
                className={clsx(getItemClassNames())}
                heightAnimation={true}
              >
                {parameter.children && (
                  <ParameterTypesItems
                    parameters={parameter.children}
                    level={level + 1}
                    expandUrl={expandUrl}
                  />
                )}
              </Details>
            )}
            {(parameter.children?.length || 0) === 0 &&
              getSummary(parameter, false)}
          </>
        )
      })}
    </div>
  )
}

export default ParameterTypesItems
