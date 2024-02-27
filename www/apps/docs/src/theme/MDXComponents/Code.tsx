import type { ComponentProps } from "react"
import React from "react"
import CodeBlock from "@theme/CodeBlock"
import type { Props } from "@theme/MDXComponents/Code"
import { InlineCode } from "docs-ui"

export default function MDXCode(props: Omit<Props, "key">): JSX.Element {
  const shouldBeInline = React.Children.toArray(props.children).every(
    (el) => typeof el === "string" && !el.includes("\n")
  )

  return shouldBeInline ? (
    <InlineCode {...props} />
  ) : (
    <CodeBlock {...(props as ComponentProps<typeof CodeBlock>)} />
  )
}
