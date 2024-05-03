import React from "react"
import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  CodeMdx,
  Details,
  Kbd,
  Note,
  Card,
  CardList,
  DetailsSummary,
  DetailsProps,
  ZoomImg,
  Link,
} from "@/components"
import clsx from "clsx"
import { Text } from "@medusajs/ui"

export const MDXComponents: MDXComponentsType = {
  code: CodeMdx,
  kbd: Kbd,
  Kbd,
  Note,
  details: Details,
  Details: ({ className, ...props }: DetailsProps) => {
    return <Details {...props} className={clsx(className, "my-docs_1")} />
  },
  Summary: DetailsSummary,
  Card,
  CardList,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h1
        className={clsx(
          "h1-docs [&_code]:!h1-docs [&_code]:!font-mono mb-docs_1 text-medusa-fg-base",
          className
        )}
        {...props}
      />
    )
  },
  h2: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h2
        className={clsx(
          "h2-docs [&_code]:!h2-docs [&_code]:!font-mono mb-docs_1 mt-docs_4 text-medusa-fg-base",
          props.id && "group/h2",
          className
        )}
        {...props}
      >
        {children}
        {props.id && (
          <Link
            href={`#${props.id}`}
            className="opacity-0 group-hover/h2:opacity-100 transition-opacity ml-docs_0.5 inline-block"
          >
            #
          </Link>
        )}
      </h2>
    )
  },
  h3: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h3
        className={clsx(
          "h3-docs [&_code]:!h3-docs [&_code]:!font-mono mb-docs_0.5 mt-docs_3 text-medusa-fg-base",
          props.id && "group/h3",
          className
        )}
        {...props}
      >
        {children}
        {props.id && (
          <Link
            href={`#${props.id}`}
            className="opacity-0 group-hover/h3:opacity-100 transition-opacity ml-docs_0.5 inline-block"
          >
            #
          </Link>
        )}
      </h3>
    )
  },
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h4
        className={clsx("mb-docs_0.5 text-medusa-fg-base text-h4", className)}
        {...props}
      />
    )
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
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
  ul: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLUListElement>) => {
    return (
      <ul
        {...props}
        className={clsx(
          "list-disc px-docs_1 mb-docs_1.5 [&_ul]:mb-0 [&_ol]:mb-0 [&_p]:!mb-0",
          className
        )}
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
          "list-decimal px-docs_1 mb-docs_1.5 [&_ul]:mb-0 [&_ol]:mb-0 [&_p]:!mb-0",
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
  }: React.HTMLAttributes<HTMLElement>) => {
    return (
      <li className={clsx("text-medusa-fg-subtle", className)} {...props}>
        <Text as="span">{children}</Text>
      </li>
    )
  },
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => {
    return (
      <hr
        className={clsx(
          "my-docs_2 h-[1px] w-full border-0 bg-medusa-border-base",
          className
        )}
        {...props}
      />
    )
  },
  img: (
    props: React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >
  ) => {
    // omit key to resolve errors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, ...rest } = props
    return <ZoomImg {...rest} />
  },
}
