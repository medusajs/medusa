"use client"

import React, { useMemo, useState } from "react"
import clsx from "clsx"
import { HighlightProps, Highlight, themes } from "prism-react-renderer"
import { ApiRunner, CopyButton, Tooltip, Link } from "@/components"
import { useColorMode } from "@/providers"
import { ExclamationCircle, PlaySolid, SquareTwoStack } from "@medusajs/icons"
import { CodeBlockHeader, CodeBlockHeaderMeta } from "./Header"
import { CodeBlockLine } from "./Line"
import { ApiAuthType, ApiDataOptions, ApiMethod } from "types"
import { CSSTransition } from "react-transition-group"
import { GITHUB_ISSUES_PREFIX } from "../.."

export type Highlight = {
  line: number
  text?: string
  tooltipText?: string
}

export type CodeBlockMetaFields = {
  title?: string
  npm2yarn?: boolean
  highlights?: string[][]
  apiTesting?: boolean
  testApiMethod?: ApiMethod
  testApiUrl?: string
  testAuthType?: ApiAuthType
  testPathParams?: ApiDataOptions
  testQueryParams?: ApiDataOptions
  testBodyParams?: ApiDataOptions
  noCopy?: boolean
  noReport?: boolean
  noLineNumbers?: boolean
} & CodeBlockHeaderMeta

export type CodeBlockStyle = "loud" | "subtle"

export type CodeBlockProps = {
  source: string
  lang?: string
  className?: string
  collapsed?: boolean
  blockStyle?: CodeBlockStyle
  children?: React.ReactNode
} & CodeBlockMetaFields &
  Omit<HighlightProps, "code" | "language" | "children">

export const CodeBlock = ({
  source,
  lang = "",
  className,
  collapsed = false,
  title = "",
  highlights = [],
  apiTesting = false,
  blockStyle = "loud",
  noCopy = false,
  noReport = false,
  noLineNumbers = false,
  children,
  ...rest
}: CodeBlockProps) => {
  if (!source && typeof children === "string") {
    source = children
  }

  const { colorMode } = useColorMode()
  const [showTesting, setShowTesting] = useState(false)
  const canShowApiTesting = useMemo(
    () =>
      apiTesting !== undefined &&
      rest.testApiMethod !== undefined &&
      rest.testApiUrl !== undefined,
    [apiTesting, rest]
  )

  const bgColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && [
          colorMode === "light" && "bg-medusa-code-bg-base",
          colorMode === "dark" && "bg-medusa-bg-component",
        ],
        blockStyle === "subtle" && [
          colorMode === "light" && "bg-medusa-bg-subtle",
          colorMode === "dark" && "bg-medusa-code-bg-base",
        ]
      ),
    [blockStyle, colorMode]
  )

  const lineNumbersColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && [
          colorMode === "light" && "text-medusa-code-text-subtle",
          colorMode === "dark" && "text-medusa-fg-muted",
        ],
        blockStyle === "subtle" && [
          colorMode === "light" && "text-medusa-fg-muted",
          colorMode === "dark" && "text-medusa-code-text-subtle",
        ]
      ),
    [blockStyle, colorMode]
  )

  const borderColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && [
          colorMode === "light" && "border-medusa-code-border",
          colorMode === "dark" && "border-medusa-border-base",
        ],
        blockStyle === "subtle" && [
          colorMode === "light" && "border-medusa-border-base",
          colorMode === "dark" && "border-medusa-code-border",
        ]
      ),
    [blockStyle, colorMode]
  )

  const iconColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && [
          colorMode === "light" && "text-medusa-code-icon",
          colorMode === "dark" && "text-medusa-fg-muted",
        ],
        blockStyle === "subtle" && [
          colorMode === "light" && "text-medusa-fg-muted",
          colorMode === "dark" && "text-medusa-code-icon",
        ]
      ),
    [blockStyle, colorMode]
  )

  if (!source.length) {
    return <></>
  }

  const transformedHighlights: Highlight[] = highlights
    .filter((highlight) => highlight.length !== 0)
    .map((highlight) => ({
      line: parseInt(highlight[0]),
      text: highlight.length >= 2 ? highlight[1] : undefined,
      tooltipText: highlight.length >= 3 ? highlight[2] : undefined,
    }))

  return (
    <>
      {title && (
        <CodeBlockHeader
          title={title}
          blockStyle={blockStyle}
          badgeLabel={rest.badgeLabel}
          badgeColor={rest.badgeColor}
        />
      )}
      <div
        className={clsx(
          "relative mb-docs_1 rounded-b-docs_DEFAULT",
          "w-full max-w-full border",
          bgColor,
          borderColor,
          collapsed && "max-h-[400px] overflow-auto",
          !title && "rounded-t-docs_DEFAULT",
          (blockStyle === "loud" || colorMode !== "light") &&
            "code-block-highlight-dark",
          blockStyle === "subtle" &&
            colorMode === "light" &&
            "code-block-highlight-light",
          className
        )}
      >
        <Highlight
          theme={
            blockStyle === "loud" || colorMode === "dark"
              ? {
                  ...themes.vsDark,
                  plain: {
                    ...themes.vsDark.plain,
                    backgroundColor:
                      blockStyle === "loud"
                        ? colorMode === "light"
                          ? "#111827"
                          : "#27282D"
                        : "#1B1B1F",
                  },
                }
              : {
                  ...themes.vsLight,
                  plain: {
                    ...themes.vsLight.plain,
                    backgroundColor: "#F9FAFB",
                  },
                }
          }
          code={source.trim()}
          language={lang.toLowerCase()}
          {...rest}
        >
          {({ className: preClassName, style, tokens, ...rest }) => (
            <>
              <pre
                style={{ ...style, fontStretch: "100%" }}
                className={clsx(
                  "relative !my-0 break-words bg-transparent !outline-none",
                  "overflow-auto break-words rounded-docs_DEFAULT p-0 xs:max-w-[83%]",
                  preClassName
                )}
              >
                <code
                  className={clsx(
                    "text-code-body font-monospace table min-w-full pb-docs_1.5 print:whitespace-pre-wrap",
                    tokens.length > 1 && "pt-docs_1 pr-docs_1",
                    tokens.length <= 1 && "!py-docs_0.25 px-[6px]"
                  )}
                >
                  {tokens.map((line, i) => {
                    const highlightedLines = transformedHighlights.filter(
                      (highlight) => highlight.line - 1 === i
                    )

                    return (
                      <CodeBlockLine
                        line={line}
                        lineNumber={i}
                        highlights={highlightedLines}
                        showLineNumber={!noLineNumbers && tokens.length > 1}
                        key={i}
                        bgColorClassName={bgColor}
                        lineNumberColorClassName={lineNumbersColor}
                        {...rest}
                      />
                    )
                  })}
                </code>
              </pre>
              <div
                className={clsx(
                  "absolute hidden md:flex md:justify-end",
                  "xs:rounded xs:absolute xs:right-0 xs:top-0 xs:w-[calc(10%+24px)] xs:h-full xs:bg-transparent",
                  tokens.length === 1 && "md:right-[6px] md:top-0",
                  tokens.length > 1 && "md:right-docs_1 md:top-docs_1"
                )}
              >
                {canShowApiTesting && (
                  <Tooltip
                    text="Test API"
                    tooltipClassName="font-base"
                    className={clsx(
                      "h-fit",
                      tokens.length === 1 && "p-[6px]",
                      tokens.length > 1 && "px-[6px] pb-[6px]"
                    )}
                  >
                    <PlaySolid
                      className={clsx("cursor-pointer", iconColor)}
                      onClick={() => setShowTesting(true)}
                    />
                  </Tooltip>
                )}
                {!noReport && (
                  <Tooltip
                    text="Report Issue"
                    tooltipClassName="font-base"
                    className={clsx(
                      "h-fit",
                      tokens.length === 1 && "p-[6px]",
                      tokens.length > 1 && "px-[6px] pb-[6px]"
                    )}
                  >
                    <Link
                      href={`${GITHUB_ISSUES_PREFIX}&title=${encodeURIComponent(
                        `Docs(Code Issue): `
                      )}`}
                      target="_blank"
                      className={clsx(
                        blockStyle === "loud" && "hover:bg-medusa-code-bg-base",
                        "bg-transparent border-none cursor-pointer rounded",
                        "[&:not(:first-child)]:ml-docs_0.5",
                        "inline-flex justify-center items-center invisible xs:visible"
                      )}
                      rel="noreferrer"
                    >
                      <ExclamationCircle className={clsx(iconColor)} />
                    </Link>
                  </Tooltip>
                )}
                {!noCopy && (
                  <CopyButton
                    text={source}
                    tooltipClassName="font-base"
                    className={clsx(
                      "h-fit",
                      tokens.length === 1 && "p-[6px]",
                      tokens.length > 1 && "px-[6px] pb-[6px]"
                    )}
                  >
                    <SquareTwoStack className={clsx(iconColor)} />
                  </CopyButton>
                )}
              </div>
            </>
          )}
        </Highlight>
      </div>
      {canShowApiTesting && (
        <CSSTransition
          unmountOnExit
          in={showTesting}
          timeout={150}
          classNames={{
            enter: "animate-fadeIn animate-fastest",
            exit: "animate-fadeOut animate-fastest",
          }}
        >
          <ApiRunner
            apiMethod={rest.testApiMethod!}
            apiUrl={rest.testApiUrl!}
            pathData={rest.testPathParams}
            bodyData={rest.testBodyParams}
            queryData={rest.testQueryParams}
          />
        </CSSTransition>
      )}
    </>
  )
}
