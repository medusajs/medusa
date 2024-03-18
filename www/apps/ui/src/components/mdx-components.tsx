"use client"

import { clx } from "@medusajs/ui"
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
import { Link, Card, BorderedIcon, MDXComponents, CodeBlock } from "docs-ui"

interface MdxProps {
  code: string
}

const components = {
  ...MDXComponents,
  a: ({
    className,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href && href?.startsWith("/")

    if (isInternal) {
      return <Link className={className} href={href} {...props} />
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
