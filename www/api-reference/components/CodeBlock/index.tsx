"use client"

import clsx from "clsx"
import { Highlight, HighlightProps, themes } from "prism-react-renderer"

export type CodeBlockProps = {
  source: string
  lang?: string
  preClassName?: string
} & Omit<HighlightProps, "code" | "language" | "children">

const CodeBlock = ({
  source,
  lang = "",
  preClassName,
  ...rest
}: CodeBlockProps) => {
  return (
    <Highlight
      theme={themes.vsDark}
      code={source.trim()}
      language={lang}
      {...rest}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className={clsx("rounded", className, preClassName)}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {tokens.length > 1 && <span className="mr-1">{i + 1}</span>}
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
