"use client"

import clsx from "clsx"
import { Highlight, HighlightProps, themes } from "prism-react-renderer"
import CopyButton from "../CopyButton"
import IconCopy from "../Icons/Copy"

export type CodeBlockProps = {
  source: string
  lang?: string
  className?: string
  collapsed?: boolean
} & Omit<HighlightProps, "code" | "language" | "children">

const CodeBlock = ({
  source,
  lang = "",
  className,
  collapsed = false,
  ...rest
}: CodeBlockProps) => {
  return (
    <div
      className={clsx(
        "bg-medusa-code-block-bg relative mb-1 rounded",
        "border-medusa-code-block-border border",
        "xs:after:content-[''] xs:after:rounded xs:after:absolute xs:after:right-0 xs:after:top-0 xs:after:w-[calc(10%+24px)] xs:after:h-full xs:after:bg-code-fade",
        collapsed && "max-h-[400px] overflow-auto",
        className
      )}
    >
      <Highlight
        theme={{
          ...themes.vsDark,
          plain: {
            ...themes.vsDark.plain,
            backgroundColor: "#151718",
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
          <pre
            style={{ ...style, fontStretch: "100%" }}
            className={clsx(
              "xs:max-w-[90%] relative !mt-0 break-words bg-transparent !outline-none",
              "overflow-auto break-words rounded",
              preClassName
            )}
          >
            <code
              className={clsx(
                "text-code font-monospace table min-w-full print:whitespace-pre-wrap",
                tokens.length > 1 && "py-1 pr-1",
                tokens.length <= 1 && "p-1"
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
                          "text-medusa-text-subtle mr-1 table-cell select-none",
                          "bg-medusa-code-block-bg sticky left-0 w-[1%] px-1 text-right"
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
        )}
      </Highlight>
      <div className={clsx("absolute right-1 top-1 z-50 flex gap-1")}>
        <CopyButton text={source} tooltipClassName="font-base">
          <IconCopy />
        </CopyButton>
      </div>
    </div>
  )
}

export default CodeBlock
