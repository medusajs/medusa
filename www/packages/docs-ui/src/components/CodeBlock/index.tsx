"use client"

import React, { useMemo, useState } from "react"
import clsx from "clsx"
import { HighlightProps, Highlight, themes } from "prism-react-renderer"
import { ApiRunner } from "@/components"
import { useColorMode } from "@/providers"
import { CodeBlockHeader, CodeBlockHeaderMeta } from "./Header"
import { CodeBlockLine } from "./Line"
import { ApiAuthType, ApiDataOptions, ApiMethod } from "types"
import { CSSTransition } from "react-transition-group"
import { CodeBlockActions, CodeBlockActionsProps } from "./Actions"

export type Highlight = {
  line: number
  text?: string
  tooltipText?: string
}

export type CodeBlockMetaFields = {
  title?: string
  hasTabs?: boolean
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
  hasTabs = false,
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
  const hasInnerCodeBlock = useMemo(
    () => hasTabs || title.length > 0,
    [hasTabs, title]
  )
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
        blockStyle === "loud" && "bg-medusa-contrast-bg-base",
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
        blockStyle === "loud" && "text-medusa-contrast-fg-secondary",
        blockStyle === "subtle" && [
          colorMode === "light" && "text-medusa-fg-muted",
          colorMode === "dark" && "text-medusa-contrast-fg-secondary",
        ]
      ),
    [blockStyle, colorMode]
  )

  const borderColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && "border-transparent",
        blockStyle === "subtle" && [
          colorMode === "light" && "border-medusa-border-base",
          colorMode === "dark" && "border-medusa-code-border",
        ]
      ),
    [blockStyle, colorMode]
  )

  const boxShadow = useMemo(
    () =>
      clsx(
        blockStyle === "loud" &&
          "shadow-elevation-code-block dark:shadow-elevation-code-block-dark",
        blockStyle === "subtle" && "shadow-none"
      ),
    [blockStyle]
  )

  const innerBgColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && [
          hasInnerCodeBlock && "bg-medusa-contrast-bg-subtle",
          !hasInnerCodeBlock && "bg-medusa-contrast-bg-base",
        ],
        blockStyle === "subtle" && bgColor
      ),
    [blockStyle, bgColor, hasInnerCodeBlock]
  )

  const innerBorderClasses = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && [
          hasInnerCodeBlock &&
            "border border-solid border-medusa-contrast-border-bot rounded-docs_DEFAULT",
          !hasInnerCodeBlock && "border-transparent rounded-docs_DEFAULT",
        ],
        blockStyle === "subtle" && "border-transparent rounded-docs_DEFAULT"
      ),
    [blockStyle, hasInnerCodeBlock]
  )

  const language = useMemo(() => {
    const lowerLang = lang.toLowerCase()

    // due to a hydration error in json, for now we just assign it to plain
    return lowerLang === "json" ? "plain" : lowerLang
  }, [lang])

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

  const actionsProps: Omit<CodeBlockActionsProps, "inHeader"> = {
    source,
    canShowApiTesting,
    onApiTesting: setShowTesting,
    blockStyle,
    noReport,
    noCopy,
  }

  return (
    <>
      <div
        className={clsx(
          hasInnerCodeBlock && "rounded-docs_lg",
          !hasInnerCodeBlock && "rounded-docs_DEFAULT",
          !hasTabs && boxShadow,
          (blockStyle === "loud" || colorMode !== "light") &&
            "code-block-highlight-dark",
          blockStyle === "subtle" &&
            colorMode === "light" &&
            "code-block-highlight-light"
        )}
      >
        {title && (
          <CodeBlockHeader
            title={title}
            blockStyle={blockStyle}
            badgeLabel={rest.badgeLabel}
            badgeColor={rest.badgeColor}
            actionsProps={{
              ...actionsProps,
              inHeader: true,
            }}
          />
        )}
        <div
          className={clsx(
            "relative mb-docs_1",
            "w-full max-w-full border",
            bgColor,
            borderColor,
            collapsed && "max-h-[400px] overflow-auto",
            hasInnerCodeBlock && "p-[5px] !pt-0 rounded-b-docs_lg",
            !hasInnerCodeBlock && "rounded-docs_DEFAULT",
            className
          )}
        >
          <Highlight
            theme={
              blockStyle === "loud" || colorMode === "dark"
                ? themes.vsDark
                : themes.vsLight
            }
            code={source.trim()}
            language={language}
            {...rest}
          >
            {({
              className: preClassName,
              style: { backgroundColor, ...style },
              tokens,
              ...rest
            }) => (
              <div className={clsx(innerBorderClasses, innerBgColor)}>
                <pre
                  style={{ ...style, fontStretch: "100%" }}
                  className={clsx(
                    "relative !my-0 break-words bg-transparent !outline-none",
                    "overflow-auto break-words p-0",
                    "rounded-docs_DEFAULT",
                    !hasInnerCodeBlock &&
                      tokens.length <= 1 &&
                      "px-docs_0.5 py-[6px]",
                    !title.length && "xs:max-w-[83%]",
                    preClassName
                  )}
                >
                  <code
                    className={clsx(
                      "text-code-body font-monospace table min-w-full print:whitespace-pre-wrap",
                      tokens.length > 1 && "py-docs_0.75",
                      tokens.length <= 1 && "!py-[6px] px-docs_0.5"
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
                          lineNumberColorClassName={lineNumbersColor}
                          {...rest}
                        />
                      )
                    })}
                  </code>
                </pre>
                {!title && (
                  <CodeBlockActions
                    {...actionsProps}
                    inHeader={false}
                    isSingleLine={tokens.length <= 1}
                  />
                )}
              </div>
            )}
          </Highlight>
        </div>
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
