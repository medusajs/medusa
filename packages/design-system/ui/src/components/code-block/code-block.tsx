"use client"
import { Highlight, Prism, themes } from "prism-react-renderer"
import * as React from "react"
;(typeof global !== "undefined" ? global : window).Prism = Prism

// @ts-ignore
import("prismjs/components/prism-json")

import { Copy } from "@/components/copy"
import { clx } from "@/utils/clx"

export type CodeSnippet = {
  /**
   * The label of the code snippet's tab.
   */
  label: string
  /**
   * The language of the code snippet. For example, `tsx`.
   */
  language: string
  /**
   * The code snippet.
   */
  code: string
  /**
   * Whether to hide the line numbers shown as the side of the code snippet.
   */
  hideLineNumbers?: boolean
  /**
   * Whether to hide the copy button.
   */
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

/**
 * This component is based on the `div` element and supports all of its props
 */
const Root = ({
  /**
   * The code snippets.
   */
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
Root.displayName = "CodeBlock"

type HeaderProps = {
  hideLabels?: boolean
}

/**
 * This component is based on the `div` element and supports all of its props
 */
const HeaderComponent = ({
  children,
  className,
  /**
   * Whether to hide the code snippets' labels.
   */
  hideLabels = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & HeaderProps) => {
  const { snippets, active, setActive } = useCodeBlockContext()
  return (
    <div
      className={clx(
        "border-b-ui-code-border bg-ui-code-bg-subtle flex items-center gap-2 border-b px-4 py-3",
        className
      )}
      {...props}
    >
      {!hideLabels &&
        snippets.map((snippet) => (
          <div
            className={clx(
              "text-ui-code-fg-subtle txt-compact-small-plus transition-fg cursor-pointer rounded-full border border-transparent px-3 py-2",
              {
                "text-ui-code-fg-base border-ui-code-border bg-ui-code-bg-base cursor-default":
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
HeaderComponent.displayName = "CodeBlock.Header"

/**
 * This component is based on the `div` element and supports all of its props
 */
const Meta = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clx(
        "txt-compact-small text-ui-code-fg-subtle ml-auto",
        className
      )}
      {...props}
    />
  )
}
Meta.displayName = "CodeBlock.Header.Meta"

const Header = Object.assign(HeaderComponent, { Meta })

/**
 * This component is based on the `div` element and supports all of its props
 */
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
          className="text-ui-code-fg-muted absolute right-4 top-4"
        />
      )}
      <div className="max-w-[90%]">
        <Highlight
          theme={{
            ...themes.palenight,
            plain: {
              color: "rgba(249, 250, 251, 1)",
              backgroundColor: "rgb(17,24,39)",
            },
            styles: [
              ...themes.palenight.styles,
              {
                types: ["keyword"],
                style: {
                  fontStyle: "normal",
                  color: "rgb(187,160,255)",
                },
              },
              {
                types: ["punctuation", "operator"],
                style: {
                  fontStyle: "normal",
                  color: "rgb(255,255,255)",
                },
              },
              {
                types: ["constant", "boolean"],
                style: {
                  fontStyle: "normal",
                  color: "rgb(187,77,96)",
                },
              },
              {
                types: ["function"],
                style: {
                  fontStyle: "normal",
                  color: "rgb(27,198,242)",
                },
              },
              {
                types: ["number"],
                style: {
                  color: "rgb(247,208,25)",
                },
              },
              {
                types: ["property"],
                style: {
                  color: "rgb(247,208,25)",
                },
              },
              {
                types: ["maybe-class-name"],
                style: {
                  color: "rgb(255,203,107)",
                },
              },
              {
                types: ["string"],
                style: {
                  color: "rgb(73,209,110)",
                },
              },
              {
                types: ["comment"],
                style: {
                  color: "var(--code-fg-subtle)",
                },
              },
            ],
          }}
          code={active.code}
          language={active.language}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={clx("code-body whitespace-pre-wrap bg-transparent", {
                "grid grid-cols-[auto,1fr] gap-x-4": !active.hideLineNumbers,
              })}
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
                      className="text-ui-code-fg-subtle tabular-nums"
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
Body.displayName = "CodeBlock.Body"

const CodeBlock = Object.assign(Root, { Body, Header, Meta })

export { CodeBlock }
