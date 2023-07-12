"use server"

import { MDXRemote } from "next-mdx-remote/rsc"
import getCustomComponents, { ScopeType } from "../../MDXComponents"
import { MDXRemoteProps } from "next-mdx-remote"
import getMdxOptions from "@/utils/get-mdx-options"

type MDXContentServerProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          mdxOptions: getMdxOptions(),
          scope: props.scope,
        }}
        {...props}
      />
    </>
  )
}

export default MDXContentServer
