"use client"

import { Text, clx } from "@medusajs/ui"
import { useMDXComponent } from "next-contentlayer/hooks"
import * as React from "react"

import { Colors } from "@/components/colors"
import { ComponentExample } from "@/components/component-example"
import { HookValues } from "@/components/hook-values"
import { IconSearch } from "@/components/icon-search"
import { PackageInstall } from "@/components/package-install"
import { Feedback } from "@/components/feedback"
import { FigmaIcon } from "@/components/figma-icon"
import { ComponentReference } from "@/components/component-reference"
import clsx from "clsx"
import { NextLink, Card, BorderedIcon, CodeMdx, CodeBlock } from "docs-ui"

interface MdxProps {
  code: string
}

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h1
        className={clx("h1-docs text-medusa-fg-base", className)}
        {...props}
      />
    )
  },
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h2
        className={clx("h2-docs mb-4 mt-16 text-medusa-fg-base", className)}
        {...props}
      />
    )
  },
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h3
        className={clx("h3-docs mb-2 mt-10 text-medusa-fg-base", className)}
        {...props}
      />
    )
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
      <Text
        className={clx("text-medusa-fg-subtle mb-docs_1.5", className)}
        {...props}
      />
    )
  },
  a: ({
    className,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href && href?.startsWith("/")

    if (isInternal) {
      return <NextLink className={className} href={href} {...props} />
    }

    return (
      <a
        className={clx(
          "txt-medium text-medusa-fg-interactive hover:text-medusa-fg-interactive-hover",
          className
        )}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      />
    )
  },
  code: CodeMdx,
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
        className={clsx("list-decimal px-docs_1 mb-docs_1.5", className)}
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
      <li className={clx("text-medusa-fg-subtle", className)} {...props}>
        <Text>{children}</Text>
      </li>
    )
  },
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => {
    return <hr className={clx("mb-4", className)} {...props} />
  },
  HookValues,
  CodeBlock,
  ComponentExample,
  PackageInstall,
  IconSearch,
  Feedback,
  Colors,
  Card,
  BorderedIcon,
  FigmaIcon,
  ComponentReference,
}

const Mdx = ({ code }: MdxProps) => {
  const Component = useMDXComponent(code)

  return (
    <div>
      <Component components={components} />
    </div>
  )
}

export { Mdx, components }
