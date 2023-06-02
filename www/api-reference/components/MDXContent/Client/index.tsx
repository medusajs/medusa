"use client"

import getCustomComponents from "../../MDXComponents"
import { MDXProvider } from "@mdx-js/react"

type MDXContentClientProps = {
  content: React.ReactNode
}

const MDXContentClient = ({ content }: MDXContentClientProps) => {
  return <MDXProvider components={getCustomComponents()}>{content}</MDXProvider>
}

export default MDXContentClient
