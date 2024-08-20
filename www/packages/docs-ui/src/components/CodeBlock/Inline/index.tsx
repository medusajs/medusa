import React from "react"
import clsx from "clsx"
import { CodeBlockProps } from "../../.."

export const CodeBlockInline = ({ source }: CodeBlockProps) => {
  return (
    <pre
      className={clsx(
        "px-[6px] bg-medusa-tag-neutral-bg",
        "w-full my-docs_0.5 rounded-docs_sm",
        "border border-medusa-tag-neutral-border",
        "whitespace-pre-wrap"
      )}
    >
      <code className="w-full text-code-label text-medusa-tag-neutral-text">
        {source}
      </code>
    </pre>
  )
}
