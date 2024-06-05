import React from "react"
import { NoteProps } from ".."
import clsx from "clsx"

type NoteLayoutProps = NoteProps & {
  icon: React.ReactNode
}

export const NoteLayout = ({
  type,
  title,
  children,
  icon,
}: NoteLayoutProps) => {
  const isDefaultStyle =
    type === "default" ||
    type === "success" ||
    type === "error" ||
    type === "check"
  const isWarningStyle = type === "warning"
  const isSoonStyle = type === "soon"

  return (
    <div
      className={clsx(
        "p-docs_0.75 border border-solid rounded shadow-none",
        isDefaultStyle && "bg-medusa-bg-component border-medusa-border-base",
        isWarningStyle && "bg-medusa-tag-red-bg border-medusa-tag-red-border",
        isSoonStyle && "bg-medusa-tag-blue-bg border-medusa-tag-blue-border",
        "[&_a]:no-underline [&_a]:text-medusa-fg-interactive hover:[&_a]:text-medusa-fg-interactive-hover",
        "mb-docs_2"
      )}
    >
      <div className={clsx("flex gap-docs_0.5")}>
        {icon}
        <div
          className={clsx(
            isDefaultStyle && "text-medusa-fg-subtle",
            isWarningStyle && "text-medusa-tag-red-text",
            isSoonStyle && "text-medusa-tag-blue-text",
            "text-medium flex-1 [&>*:last-child]:mb-0",
            "[&>p>code]:px-docs_0.5 [&>p>code]:text-code-label"
          )}
        >
          {title && (
            <span
              className={clsx(
                "text-compact-medium-plus block mb-docs_0.125",
                isDefaultStyle && "text-medusa-fg-base",
                isWarningStyle && "text-medusa-tag-red-text",
                isSoonStyle && "text-medusa-tag-blue-text"
              )}
            >
              {title}
            </span>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
