import React, { isValidElement, type ReactNode } from "react"
import useIsBrowser from "@docusaurus/useIsBrowser"
import ElementContent from "@theme/CodeBlock/Content/Element"
import StringContent from "@theme/CodeBlock/Content/String"
import type { Props } from "@theme/CodeBlock"
import clsx from "clsx"
import { Badge, BadgeVariant } from "docs-ui"

/**
 * Best attempt to make the children a plain string so it is copyable. If there
 * are react elements, we will not be able to copy the content, and it will
 * return `children` as-is; otherwise, it concatenates the string children
 * together.
 */
function maybeStringifyChildren(children: ReactNode): ReactNode {
  if (React.Children.toArray(children).some((el) => isValidElement(el))) {
    return children
  }
  // The children is now guaranteed to be one/more plain strings
  return Array.isArray(children) ? children.join("") : (children as string)
}

export default function CodeBlock({
  children: rawChildren,
  noReport = false,
  noCopy = false,
  ...props
}: Props): JSX.Element {
  // The Prism theme on SSR is always the default theme but the site theme can
  // be in a different mode. React hydration doesn't update DOM styles that come
  // from SSR. Hence force a re-render after mounting to apply the current
  // relevant styles.
  const isBrowser = useIsBrowser()
  const children = maybeStringifyChildren(rawChildren)
  const CodeBlockComp =
    typeof children === "string" ? StringContent : ElementContent

  const metastringTitleRegex = /title="?([^"]*)"?/
  const metastringBadgeLabelRegex = /badgeLabel="?([^"]*)"?/
  const metastringBadgeColorRegex = /badgeColor="?([^"]*)"?/

  let title = props.title
  delete props.title

  function extractFromMetastring(regex: RegExp): string {
    if (!props.metastring) {
      return ""
    }

    let value = ""

    const matched = props.metastring.match(regex)
    if (matched?.length) {
      value = matched[1].replace(/^"/, "").replace(/"$/, "")
      props.metastring = props.metastring.replace(regex, "")
    }

    return value
  }

  if (!title) {
    title = extractFromMetastring(metastringTitleRegex)
  }

  const badge = {
    label: extractFromMetastring(metastringBadgeLabelRegex),
    color: extractFromMetastring(metastringBadgeColorRegex),
  }

  return (
    <div className="code-wrapper">
      {(title || badge.label) && (
        <div className="code-header">
          {title}
          {badge.label && (
            <Badge
              variant={(badge.color as BadgeVariant) || "green"}
              className="justify-end"
            >
              {badge.label}
            </Badge>
          )}
        </div>
      )}
      <CodeBlockComp
        key={String(isBrowser)}
        noReport={noReport}
        noCopy={noCopy}
        {...props}
        className={clsx(
          !title && "rounded",
          title && "!rounded-t-none !rounded-b",
          props.className
        )}
        showLineNumbers={true}
      >
        {children as string}
      </CodeBlockComp>
    </div>
  )
}
