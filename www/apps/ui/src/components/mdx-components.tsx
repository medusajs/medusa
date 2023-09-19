"use client"

import { Code, Text, clx } from "@medusajs/ui"
import { useMDXComponent } from "next-contentlayer/hooks"
import Link from "next/link"
import * as React from "react"

import { CodeBlock } from "@/components/code-block"
import { Colors } from "@/components/colors"
import { ComponentExample } from "@/components/component-example"
import { ComponentProps } from "@/components/component-props"
import { HookValues } from "@/components/hook-values"
import { IconSearch } from "@/components/icon-search"
import { PackageInstall } from "@/components/package-install"
import { Snippet } from "@/components/snippet"
import { Feedback } from "./feedback"
import clsx from "clsx"
import { InlineCode } from "docs-ui"

interface MdxProps {
  code: string
}

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h1 className={clx("h1-docs text-ui-fg-base", className)} {...props} />
    )
  },
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h2
        className={clx("h2-docs mb-4 mt-16 text-ui-fg-base", className)}
        {...props}
      />
    )
  },
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h3
        className={clx("h3-docs mb-2 mt-10 text-ui-fg-base", className)}
        {...props}
      />
    )
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
      <Text
        className={clx("text-ui-fg-subtle mb-docs_1.5", className)}
        {...props}
      />
    )
  },
  a: ({ className, href, ...props }: React.ComponentPropsWithoutRef<"a">) => {
    const isInternal = href && href?.startsWith("/")

    if (isInternal) {
      return (
        <Link
          className={clx(
            "txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover",
            className
          )}
          href={href}
          {...props}
        />
      )
    }

    return (
      <a
        className={clx(
          "txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover",
          className
        )}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      />
    )
  },
  code: InlineCode,
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
  li: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    return (
      <li className={clx("text-ui-fg-subtle", className)} {...props}>
        <Text>{children}</Text>
      </li>
    )
  },
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => {
    return <hr className={clx("mb-4", className)} {...props} />
  },
  HookValues,
  ComponentProps,
  CodeBlock,
  ComponentExample,
  Snippet,
  PackageInstall,
  IconSearch,
  Feedback,
  Colors,
}

const Mdx = ({ code }: MdxProps) => {
  const Component = useMDXComponent(code)

  return (
    <div>
      <Component components={components} />
    </div>
  )
}

export { Mdx }
