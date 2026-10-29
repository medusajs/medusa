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
          "flex flex-col overflow-hidden rounded-xl bg-ui-contrast-bg-base shadow-elevation-code-block",
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

  const tabRefs = React.useRef<Array<HTMLSpanElement | null>>([])
  const tabIndicatorRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const activeTabRef = tabRefs.current.find(
      (ref) => ref?.dataset.label === active.label
    )

    if (activeTabRef && tabIndicatorRef.current) {
      const activeTabIndex = tabRefs.current.indexOf(activeTabRef)

      const prevTabRef =
        activeTabIndex > 0 ? tabRefs.current[activeTabIndex - 1] : null

      tabIndicatorRef.current.style.width = `${activeTabRef.offsetWidth}px`
      tabIndicatorRef.current.style.left = prevTabRef
        ? `${
            tabRefs.current
              .slice(0, activeTabIndex)
              .reduce((total, tab) => total + (tab?.offsetWidth || 0) + 12, 0) +
            15
          }px`
        : "15px"
    }
  }, [active])

  return (
    <div>
      <div
        className={clx("flex items-start px-4 pt-2.5", className)}
        {...props}
      >
        {!hideLabels &&
          snippets.map((snippet, idx) => (
            <div
              className={clx(
                "txt-compact-small-plus relative cursor-pointer pb-[9px] pr-3 text-ui-contrast-fg-secondary transition-fg",
                {
                  "cursor-default text-ui-contrast-fg-primary":
                    active.label === snippet.label,
                }
              )}
              key={snippet.label}
              onClick={() => setActive(snippet)}
            >
              <span
                ref={(ref) => {
                  tabRefs.current[idx] = ref
                  return undefined
                }}
                data-label={snippet.label}
              >
                {snippet.label}
              </span>
            </div>
          ))}
        {children}
      </div>
      <div className="w-full px-0.5">
        <div className="relative h-px w-full bg-ui-contrast-border-top">
          <div
            ref={tabIndicatorRef}
            className={clx(
              "absolute bottom-0 transition-all motion-reduce:transition-none",
              "duration-150 ease-linear"
            )}
          >
            <div className="h-px rounded-full bg-ui-contrast-fg-primary" />
          </div>
        </div>
      </div>
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
        "txt-compact-small ml-auto text-ui-contrast-fg-secondary",
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
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { active } = useCodeBlockContext()

  const showToolbar = children || !active.hideCopy

  return (
    <div>
      {showToolbar && (
        <div className="flex min-h-10 items-center gap-x-3 border-t border-ui-contrast-border-bot px-4 py-2">
          <div className="code-body flex-1 text-ui-contrast-fg-secondary">
            {children}
          </div>
          {!active.hideCopy && (
            <Copy
              content={active.code}
              className="text-ui-contrast-fg-secondary"
            />
          )}
        </div>
      )}
      <div className="flex h-full flex-col overflow-hidden px-[5px] pb-[5px]">
        <div
          className={clx(
            "relative h-full overflow-y-auto rounded-lg border border-ui-contrast-border-bot bg-ui-contrast-bg-subtle p-4",
            className
          )}
          {...props}
        >
          <div className="max-w-[90%]">
            <Highlight
              theme={{
                ...themes.palenight,
                plain: {
                  color: "rgba(249, 250, 251, 1)",
                  backgroundColor: "var(--contrast-fg-primary)",
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
                      color: "var(--contrast-fg-secondary)",
                      fontStyle: "normal",
                    },
                  },
                ],
              }}
              code={active.code}
              language={active.language}
            >
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={clx(
                    "code-body whitespace-pre-wrap bg-transparent",
                    {
                      "grid grid-cols-[auto,1fr] gap-x-4":
                        !active.hideLineNumbers,
                    }
                  )}
                  style={{
                    ...style,
                    background: "transparent",
                  }}
                >
                  {!active.hideLineNumbers && (
                    <div
                      role="presentation"
                      className="flex flex-col text-right"
                    >
                      {tokens.map((_, i) => (
                        <span
                          key={i}
                          className="tabular-nums text-ui-contrast-fg-secondary"
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
      </div>
    </div>
  )
}
Body.displayName = "CodeBlock.Body"

const CodeBlock = Object.assign(Root, { Body, Header, Meta })

export { CodeBlock }
