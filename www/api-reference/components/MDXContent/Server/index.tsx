"use server"

import { MDXRemote } from "next-mdx-remote/rsc"
import getCustomComponents, { ScopeType } from "../../MDXComponents"
import { MDXRemoteProps } from "next-mdx-remote"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypePrism from "@mapbox/rehype-prism"

type MDXContentServerProps = {
  content: any
} & Partial<MDXRemoteProps>

const MDXContentServer = ({ content, ...props }: MDXContentServerProps) => {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <MDXRemote
        source={content}
        components={getCustomComponents((props.scope as ScopeType) || {})}
        options={{
          mdxOptions: {
            remarkPlugins: [rehypeMdxCodeProps],
            rehypePlugins: [rehypePrism],
          },
          scope: props.scope,
        }}
        {...props}
      />
    </>
  )
}

export default MDXContentServer
