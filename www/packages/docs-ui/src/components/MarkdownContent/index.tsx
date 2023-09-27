import React from "react"
import ReactMarkdown from "react-markdown"
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown"
import { CodeMdx, Details, Kbd, Link } from "@/components"

export type MarkdownContentProps = ReactMarkdownOptions

export const MarkdownContent = ({ children }: MarkdownContentProps) => {
  return (
    <ReactMarkdown
      components={{
        code: CodeMdx,
        kbd: Kbd,
        details: Details,
        a: Link,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
