"use client"

import React from "react"
import clsx from "clsx"
import { HighlightProps, Highlight, themes } from "prism-react-renderer"
import { CopyButton, useColorMode } from "docs-ui"
import { SquareTwoStackSolid } from "@medusajs/icons"

export type CodeBlockProps = {
  source: string
  lang?: string
  className?: string
  collapsed?: boolean
} & Omit<HighlightProps, "code" | "language" | "children">

export const CodeBlock = ({
  source,
  lang = "",
  className,
  collapsed = false,
  ...rest
}: CodeBlockProps) => {
  const { colorMode } = useColorMode()

  if (!source.length) {
    return <></>
  }

  return (
    <div
      className={clsx(
        "bg-medusa-code-bg-base relative mb-docs_1 rounded-docs_DEFAULT",
        "border-medusa-code-border w-full max-w-full border",
        collapsed && "max-h-[400px] overflow-auto",
        className
      )}
    >
      <Highlight
        theme={{
          ...themes.vsDark,
          plain: {
            ...themes.vsDark.plain,
            backgroundColor: colorMode === "light" ? "#111827" : "#1B1B1F",
          },
        }}
        code={source.trim()}
        language={lang}
        {...rest}
      >
        {({
          className: preClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <>
            <pre
              style={{ ...style, fontStretch: "100%" }}
              className={clsx(
                "xs:max-w-[90%] relative !my-0 break-words bg-transparent !outline-none",
                "overflow-auto break-words rounded-docs_DEFAULT p-0",
                preClassName
              )}
            >
              <code
                className={clsx(
                  "text-code-body font-monospace table min-w-full pb-docs_1.5 print:whitespace-pre-wrap",
                  tokens.length > 1 && "pt-docs_1 pr-docs_1",
                  tokens.length <= 1 && "!py-docs_0.5 px-docs_1"
                )}
              >
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line })
                  return (
                    <span
                      key={i}
                      {...lineProps}
                      className={clsx("table-row", lineProps.className)}
                    >
                      {tokens.length > 1 && (
                        <span
                          className={clsx(
                            "text-medusa-code-text-subtle mr-docs_1 table-cell select-none",
                            "bg-medusa-code-bg-base sticky left-0 w-[1%] px-docs_1 text-right"
                          )}
                        >
                          {i + 1}
                        </span>
                      )}
                      <span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </span>
                  )
                })}
              </code>
            </pre>
            <div
              className={clsx(
                "absolute hidden gap-docs_1 md:flex",
                "xs:rounded xs:absolute xs:right-0 xs:top-0 xs:w-[calc(10%+24px)] xs:h-full xs:bg-code-fade"
              )}
            >
              <CopyButton
                text={source}
                tooltipClassName="font-base"
                className={clsx(
                  "absolute",
                  tokens.length === 1 && "right-docs_0.75 top-[10px]",
                  tokens.length > 1 && "right-docs_1 top-docs_1"
                )}
              >
                <SquareTwoStackSolid className="text-medusa-code-icon" />
              </CopyButton>
            </div>
          </>
        )}
      </Highlight>
    </div>
  )
}
