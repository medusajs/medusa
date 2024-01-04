import React from "react"
import ReactMarkdown from "react-markdown"
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown"
import { CodeMdx, Details, Kbd, Link } from "@/components"
import clsx from "clsx"
import { NormalComponents } from "react-markdown/lib/complex-types"
import { SpecialComponents } from "react-markdown/lib/ast-to-react"

export type MarkdownContentProps = ReactMarkdownOptions & {
  components?: Partial<
    Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
  >
}

export const MarkdownContent = ({
  children,
  components,
  ...props
}: MarkdownContentProps) => {
  return (
    <ReactMarkdown
      components={
        components || {
          code: CodeMdx,
          pre: ({
            className,
            children,
            ...props
          }: React.HTMLAttributes<HTMLPreElement>) => {
            return (
              <pre className={clsx("p-0 bg-transparent", className)} {...props}>
                {children}
              </pre>
            )
          },
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
              <ol
                {...props}
                className={clsx(
                  "list-decimal px-docs_1 mb-docs_1.5",
                  className
                )}
              >
                {children}
              </ol>
            )
          },
          li: ({
            className,
            children,
            ...props
          }: React.HTMLAttributes<HTMLLIElement>) => {
            return (
              <li
                className={clsx("text-medusa-fg-subtle", className)}
                {...props}
              >
                <span>{children}</span>
              </li>
            )
          },
          p: ({
            className,
            ...props
          }: React.HTMLAttributes<HTMLParagraphElement>) => {
            return (
              <p
                className={clsx(
                  "text-medusa-fg-subtle [&:not(:last-child)]:mb-docs_1.5 last:!mb-0",
                  className
                )}
                {...props}
              />
            )
          },
        }
      }
      {...props}
    >
      {children}
    </ReactMarkdown>
  )
}
