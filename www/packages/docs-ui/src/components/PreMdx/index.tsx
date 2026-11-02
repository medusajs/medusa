import React from "react"

export type PreMdxProps = React.ComponentProps<"pre">

// Code blocks with a language render their own `<pre>` through `CodeBlock`,
// so wrapping them again produces nested `<pre>` elements.
export const PreMdx = ({ children, ...props }: PreMdxProps) => {
  if (
    React.isValidElement<{ className?: string }>(children) &&
    /language-/.test(children.props.className || "")
  ) {
    return <>{children}</>
  }

  return <pre {...props}>{children}</pre>
}
