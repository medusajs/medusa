/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server"

import { MDXRemote } from "next-mdx-remote/rsc"
import getCustomComponents from "../../MDXComponents"
import type { ScopeType } from "../../MDXComponents"
import type { MDXRemoteProps } from "next-mdx-remote"

export type MDXContentServerProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
} & Partial<MDXRemoteProps>

const MDXContentServer = ({ content, ...props }: MDXContentServerProps) => {
  return (
    <>
      {/* @ts-ignore promise error */}
      <MDXRemote
        source={content}
        components={getCustomComponents((props.scope as ScopeType) || {})}
        options={{
          scope: props.scope,
          mdxOptions: {
            development: process.env.NEXT_PUBLIC_ENV === "development",
          },
        }}
        {...props}
      />
    </>
  )
}

export default MDXContentServer
