import { Highlight, HighlightProps, themes } from "prism-react-renderer"

type CodeBlockProps = {
  code: string
  language?: string
} & Omit<HighlightProps, "code" | "language" | "children">

const CodeBlock = ({ code, language = "", ...rest }: CodeBlockProps) => {
  return (
    <Highlight
      theme={themes.vsDark}
      code={code.trim()}
      language={language}
      {...rest}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className={className}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="mr-1">{i + 1}</span>
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
