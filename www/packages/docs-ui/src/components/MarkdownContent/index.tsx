import React from "react"
import ReactMarkdown, {
  Options as ReactMarkdownOptions,
  Components,
} from "react-markdown"
import { MDXComponents } from "@/components/MDXComponents"
import clsx from "clsx"

export type MarkdownContentProps = ReactMarkdownOptions & {
  components?: Partial<Components> | null | undefined
}

export const MarkdownContent = ({
  children,
  components,
  ...props
}: MarkdownContentProps) => {
  return (
    // @ts-expect-error React v19 doesn't see this type as a React element
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
        }
      }
      {...props}
    >
      {children}
    </ReactMarkdown>
  )
}
