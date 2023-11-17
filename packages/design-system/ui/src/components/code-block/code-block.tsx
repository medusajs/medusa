"use client"
import { Highlight, themes } from "prism-react-renderer"
import * as React from "react"

import { Copy } from "@/components/copy"
import { clx } from "@/utils/clx"

export type CodeSnippet = {
  label: string
  language: string
  code: string
  hideLineNumbers?: boolean
  hideCopy?: boolean
}

type CodeBlockState = {
  snippets: CodeSnippet[]
  active: CodeSnippet
  setActive: (active: CodeSnippet) => void
} | null

const CodeBlockContext = React.createContext<CodeBlockState>(null)

const useCodeBlockContext = () => {
  const context = React.useContext(CodeBlockContext)

  if (context === null)
    throw new Error(
      "useCodeBlockContext can only be used within a CodeBlockContext"
    )

  return context
}

type RootProps = {
  snippets: CodeSnippet[]
}

const Root = ({
  snippets,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & RootProps) => {
  const [active, setActive] = React.useState(snippets[0])

  return (
    <CodeBlockContext.Provider value={{ snippets, active, setActive }}>
      <div
        className={clx(
          "border-ui-code-border flex flex-col overflow-hidden rounded-lg border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CodeBlockContext.Provider>
  )
}

type HeaderProps = {
  hideLabels?: boolean
}

const HeaderComponent = ({
  children,
  className,
  hideLabels = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & HeaderProps) => {
  const { snippets, active, setActive } = useCodeBlockContext()
  return (
    <div
      className={clx(
        "border-b-ui-code-border bg-ui-code-bg-header flex items-center gap-2 border-b px-4 py-3",
        className
      )}
      {...props}
    >
      {!hideLabels &&
        snippets.map((snippet) => (
          <div
            className={clx(
              "text-ui-code-text-subtle txt-compact-small-plus cursor-pointer rounded-full border border-transparent px-3 py-2 transition-all",
              {
                "text-ui-code-text-base border-ui-code-border bg-ui-code-bg-base cursor-default":
                  active.label === snippet.label,
              }
            )}
            key={snippet.label}
            onClick={() => setActive(snippet)}
          >
            {snippet.label}
          </div>
        ))}
      {children}
    </div>
  )
}

const Meta = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clx("text-ui-code-text-subtle ml-auto", className)}
      {...props}
    />
  )
}

const Header = Object.assign(HeaderComponent, { Meta })

const Body = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { active } = useCodeBlockContext()
  return (
    <div
      className={clx(
        "bg-ui-code-bg-base relative h-full overflow-y-auto p-4",
        className
      )}
      {...props}
    >
      {!active.hideCopy && (
        <Copy
          content={active.code}
          className="text-ui-code-icon absolute right-4 top-4"
        />
      )}
      <div className="max-w-[90%]">
        <Highlight
          theme={{
            ...themes.palenight,
            plain: {
              color: "rgba(249, 250, 251, 1)",
              backgroundColor: "#111827",
            },
            styles: [
              {
                types: ["keyword"],
                style: {
                  color: "var(--fg-on-color)",
                },
              },
              {
                types: ["maybe-class-name"],
                style: {
                  color: "rgb(255, 203, 107)",
                },
              },
              ...themes.palenight.styles,
            ],
          }}
          code={active.code}
          language={active.language}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={clx(
                "txt-compact-small whitespace-pre-wrap bg-transparent font-mono",
                {
                  "grid grid-cols-[auto,1fr] gap-x-4": !active.hideLineNumbers,
                }
              )}
              style={{
                ...style,
                background: "transparent",
              }}
            >
              {!active.hideLineNumbers && (
                <div role="presentation" className="flex flex-col text-right">
                  {tokens.map((_, i) => (
                    <span
                      key={i}
                      className="text-ui-code-text-subtle tabular-nums"
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              )}
              <div>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </div>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}

const CodeBlock = Object.assign(Root, { Body, Header, Meta })

export { CodeBlock }
