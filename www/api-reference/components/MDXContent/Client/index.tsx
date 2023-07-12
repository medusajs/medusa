"use client"

import { useEffect, useState } from "react"
import getCustomComponents, { ScopeType } from "../../MDXComponents"
import {
  MDXRemote,
  MDXRemoteProps,
  MDXRemoteSerializeResult,
} from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Loading from "@/app/loading"
import getMdxOptions from "@/utils/get-mdx-options"

export type MDXContentClientProps = {
  content: any
} & Partial<MDXRemoteProps>

const MDXContentClient = ({ content, ...props }: MDXContentClientProps) => {
  const [parsedContent, setParsedContent] = useState<MDXRemoteSerializeResult>()

  useEffect(() => {
    void serialize(content, {
      mdxOptions: {
        ...getMdxOptions(),
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
    <>
      {!parsedContent && <Loading />}
      {parsedContent !== undefined && (
        <MDXRemote
          {...parsedContent}
          components={getCustomComponents((props.scope as ScopeType) || {})}
        />
      )}
    </>
  )
}

export default MDXContentClient
