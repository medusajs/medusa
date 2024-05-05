import React from "react"
import ReactMarkdown from "react-markdown"
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown"
import { MDXComponents, Link } from "@/components"
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
          ...MDXComponents,
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
          a: Link,
        }
      }
      {...props}
    >
      {children}
    </ReactMarkdown>
  )
}
