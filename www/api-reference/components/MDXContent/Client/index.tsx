"use client"

import { ReactNode } from "react"
import getCustomComponents from "../../MDXComponents"
import { MDXProvider } from "@mdx-js/react"

export type MDXContentClientProps = {
  content: ReactNode
}

const MDXContentClient = ({ content }: MDXContentClientProps) => {
  return <MDXProvider components={getCustomComponents()}>{content}</MDXProvider>
}

export default MDXContentClient
