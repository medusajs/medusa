import React from "react"
import ReactMarkdown from "react-markdown"
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown"
import { CodeMdx, Details, Kbd, Link } from "@/components"
import clsx from "clsx"
import { Text } from "@medusajs/ui"

export type MarkdownContentProps = ReactMarkdownOptions

export const MarkdownContent = ({ children }: MarkdownContentProps) => {
  return (
    <ReactMarkdown
      components={{
        code: CodeMdx,
        kbd: Kbd,
        details: Details,
        a: Link,
        ul: ({
          className,
          children,
          ...props
        }: React.HTMLAttributes<HTMLUListElement>) => {
          return (
            <ul
              {...props}
              className={clsx("list-disc px-docs_1 mb-docs_1.5", className)}
            >
              {children}
            </ul>
          )
        },
        ol: ({
          className,
          children,
          ...props
        }: React.HTMLAttributes<HTMLOListElement>) => {
          return (
            <ul
              {...props}
              className={clsx("list-decimal px-docs_1 mb-docs_1.5", className)}
            >
              {children}
            </ul>
          )
        },
        li: ({
          className,
          children,
          ...props
        }: React.HTMLAttributes<HTMLElement>) => {
          return (
            <li className={clsx("text-medusa-fg-subtle", className)} {...props}>
              <Text>{children}</Text>
            </li>
          )
        },
        p: ({
          className,
          ...props
        }: React.HTMLAttributes<HTMLParagraphElement>) => {
          return (
            <Text
              className={clsx(
                "text-medusa-fg-subtle [&:not(:last-child)]:mb-docs_1.5",
                className
              )}
              {...props}
            />
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
