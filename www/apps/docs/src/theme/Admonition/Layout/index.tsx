import React, { type ReactNode } from "react"
import clsx from "clsx"

import type { Props } from "@theme/Admonition/Layout"

function AdmonitionContainer({
  className,
  children,
}: Pick<Props, "type" | "className"> & { children: ReactNode }) {
  return (
    <div
      className={clsx(
        "p-1 border border-solid border-medusa-border-base rounded",
        "bg-medusa-bg-subtle dark:bg-medusa-bg-base shadow-none",
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

function AdmonitionContent({ children }: Pick<Props, "children">) {
  return children ? (
    <div
      className={clsx(
        "text-medusa-fg-subtle",
        "text-medium flex-1 [&>*:last-child]:mb-0",
        "[&>p>code]:px-0.5 [&>p>code]:text-code-label"
      )}
    >
      {children}
    </div>
  ) : null
}

export default function AdmonitionLayout(props: Props): JSX.Element {
  const { type, icon, children, className } = props
  return (
    <AdmonitionContainer type={type} className={className}>
      <AdmonitionHeading icon={icon} />
      <AdmonitionContent>{children}</AdmonitionContent>
    </AdmonitionContainer>
  )
}
