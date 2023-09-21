"use client"

import { useEffect, useState } from "react"
import getCustomComponents from "../../MDXComponents"
import type { ScopeType } from "../../MDXComponents"
import { MDXRemote } from "next-mdx-remote"
import type { MDXRemoteProps, MDXRemoteSerializeResult } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"

export type MDXContentClientProps = {
  content: any
  className?: string
} & Partial<MDXRemoteProps>

const MDXContentClient = ({
  content,
  className,
  ...props
}: MDXContentClientProps) => {
  const [parsedContent, setParsedContent] = useState<MDXRemoteSerializeResult>()

  useEffect(() => {
    void serialize(content, {
      mdxOptions: {
        // A workaround for an error in next-mdx-remote
        // more details in this issue:
        // https://github.com/hashicorp/next-mdx-remote/issues/350
        development: process.env.NEXT_PUBLIC_ENV === "development",
      },
      scope: props.scope,
    }).then((output) => {
      setParsedContent(output)
    })
  }, [content, props.scope])

  return (
    <div className={className}>
      {parsedContent !== undefined && (
        <MDXRemote
          {...parsedContent}
          components={getCustomComponents((props.scope as ScopeType) || {})}
        />
      )}
    </div>
  )
}

export default MDXContentClient
