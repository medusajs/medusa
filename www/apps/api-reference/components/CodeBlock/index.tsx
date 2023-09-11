"use client"

import clsx from "clsx"
import { Highlight, HighlightProps, themes } from "prism-react-renderer"
import CopyButton from "../CopyButton"
import IconCopy from "../Icons/Copy"
import { useColorMode } from "../../providers/color-mode"

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
  const { colorMode } = useColorMode()

  return (
    <div
      className={clsx(
        "bg-medusa-code-bg-base dark:bg-medusa-code-bg-base-dark relative mb-1 rounded",
        "border-medusa-code-border dark:border-medusa-code-border-dark w-full max-w-full border",
        "xs:after:content-[''] xs:after:rounded xs:after:absolute xs:after:right-0 xs:after:top-0 xs:after:w-[calc(10%+24px)] xs:after:h-full xs:after:bg-code-fade xs:dark:after:bg-code-fade-dark",
        collapsed && "max-h-[400px] overflow-auto",
        className
      )}
    >
      <Highlight
        theme={{
          ...themes.vsDark,
          plain: {
            ...themes.vsDark.plain,
            backgroundColor: colorMode === "light" ? "#111827" : "#1E1E1E",
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
                "xs:max-w-[90%] relative !mt-0 break-words bg-transparent !outline-none",
                "overflow-auto break-words rounded",
                preClassName
              )}
            >
              <code
                className={clsx(
                  "text-code-body font-monospace table min-w-full pb-1.5 print:whitespace-pre-wrap",
                  tokens.length > 1 && "pt-1 pr-1",
                  tokens.length <= 1 && "py-0.5 px-1"
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
                            "text-medusa-code-text-subtle dark:text-medusa-code-text-subtle-dark mr-1 table-cell select-none",
                            "bg-medusa-code-bg-base dark:bg-medusa-code-bg-base-dark sticky left-0 w-[1%] px-1 text-right"
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
                "absolute z-50 hidden gap-1 md:flex",
                tokens.length === 1 && "right-0.75 top-[10px]",
                tokens.length > 1 && "right-1 top-1"
              )}
            >
              <CopyButton text={source} tooltipClassName="font-base">
                <IconCopy className="fill-medusa-code-icon dark:fill-medusa-code-icon-dark" />
              </CopyButton>
            </div>
          </>
        )}
      </Highlight>
    </div>
  )
}

export default CodeBlock
