import React, { type ReactNode } from "react"
import clsx from "clsx"

import type { Props } from "@theme/Admonition/Layout"

function AdmonitionContainer({
  className,
  children,
  type,
}: Pick<Props, "type" | "className"> & { children: ReactNode }) {
  return (
    <div
      className={clsx(
        "p-1 border border-solid  rounded shadow-none",
        (type === "note" || type === "info" || type === "tip") &&
          "bg-medusa-tag-neutral-bg border-medusa-tag-neutral-border",
        (type === "danger" || type === "warning" || type === "caution") &&
          "bg-medusa-tag-red-bg border-medusa-tag-red-border",
        "[&_a]:no-underline [&_a]:text-medusa-fg-interactive hover:[&_a]:text-medusa-fg-interactive-hover ",
        "mb-2 alert",
        className
      )}
    >
      <div className={clsx("flex")}>{children}</div>
    </div>
  )
}

function AdmonitionHeading({ icon }: Pick<Props, "icon">) {
  return <span className={clsx("inline-block h-1.5 w-1.5 mr-1")}>{icon}</span>
}

function AdmonitionContent({
  children,
  title,
  type,
}: Pick<Props, "children" | "title" | "type">) {
  return children ? (
    <div
      className={clsx(
        (type === "note" || type === "info" || type === "tip") &&
          "text-medusa-tag-neutral-text",
        (type === "danger" || type === "warning" || type === "caution") &&
          "text-medusa-tag-red-text",
        "text-medium flex-1 [&>*:last-child]:mb-0",
        "[&>p>code]:px-0.5 [&>p>code]:text-code-label"
      )}
    >
      {title && (
        <span className="txt-compact-medium-plus block mb-0.125">
          {transformAdmonitionTitle(title)}
        </span>
      )}
      {children}
    </div>
  ) : null
}

export default function AdmonitionLayout(props: Props): JSX.Element {
  const { type, icon, children, className, title } = props
  return (
    <AdmonitionContainer type={type} className={className}>
      <AdmonitionHeading icon={icon} />
      <AdmonitionContent title={title} type={type}>
        {children}
      </AdmonitionContent>
    </AdmonitionContainer>
  )
}

function transformAdmonitionTitle<T = unknown>(title: T): T | string {
  if (typeof title !== "string") {
    return title
  }
  switch (title) {
    case "note":
    case "tip":
    case "danger":
    case "warning":
    case "info":
    case "caution":
      return title.charAt(0).toUpperCase + title.substring(1)
    default:
      return title
  }
}
