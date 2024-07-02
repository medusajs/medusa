"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import { Highlight, HighlightProps, themes, Token } from "prism-react-renderer"
import { ApiRunner } from "@/components"
import { useColorMode } from "@/providers"
import { CodeBlockHeader, CodeBlockHeaderMeta } from "./Header"
import { CodeBlockLine } from "./Line"
import { ApiAuthType, ApiDataOptions, ApiMethod } from "types"
import { CSSTransition } from "react-transition-group"
import { useCollapsibleCodeLines } from "../.."
import { HighlightProps as CollapsibleHighlightProps } from "@/hooks"
import { CodeBlockActions, CodeBlockActionsProps } from "./Actions"
import { CodeBlockCollapsibleButton } from "./Collapsible/Button"
import { CodeBlockCollapsibleFade } from "./Collapsible/Fade"

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
  collapsibleLines?: string
  expandButtonLabel?: string
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
  collapsibleLines,
  expandButtonLabel,
  ...rest
}: CodeBlockProps) => {
  if (!source && typeof children === "string") {
    source = children
  }

  const { colorMode } = useColorMode()
  const [showTesting, setShowTesting] = useState(false)
  const codeContainerRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const [scrollable, setScrollable] = useState(false)
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
        blockStyle === "loud" && "border-0",
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

  const transformedHighlights: Highlight[] = highlights
    .filter((highlight) => highlight.length !== 0)
    .map((highlight) => ({
      line: parseInt(highlight[0]),
      text: highlight.length >= 2 ? highlight[1] : undefined,
      tooltipText: highlight.length >= 3 ? highlight[2] : undefined,
    }))

  const getLines = (
    tokens: Token[][],
    highlightProps: CollapsibleHighlightProps,
    lineNumberOffset = 0
  ) =>
    tokens.map((line, i) => {
      const offsettedLineNumber = i + lineNumberOffset
      const highlightedLines = transformedHighlights.filter(
        (highlight) => highlight.line - 1 === offsettedLineNumber
      )

      return (
        <CodeBlockLine
          line={line}
          lineNumber={offsettedLineNumber}
          highlights={highlightedLines}
          showLineNumber={!noLineNumbers && tokens.length > 1}
          key={offsettedLineNumber}
          lineNumberColorClassName={lineNumbersColor}
          lineNumberBgClassName={innerBgColor}
          {...highlightProps}
        />
      )
    })

  const {
    getCollapsedLinesElm,
    getNonCollapsedLinesElm,
    type: collapsibleType,
    ...collapsibleResult
  } = useCollapsibleCodeLines({
    collapsibleLinesStr: collapsibleLines,
    getLines,
  })

  useEffect(() => {
    if (!codeContainerRef.current || !codeRef.current) {
      return
    }

    setScrollable(
      codeContainerRef.current.scrollWidth < codeRef.current.clientWidth
    )
  }, [codeContainerRef.current, codeRef.current])

  const actionsProps: Omit<CodeBlockActionsProps, "inHeader"> = useMemo(
    () => ({
      source,
      canShowApiTesting,
      onApiTesting: setShowTesting,
      blockStyle,
      noReport,
      noCopy,
      isCollapsed: collapsibleType !== undefined && collapsibleResult.collapsed,
      inInnerCode: hasInnerCodeBlock,
      showGradientBg: scrollable,
    }),
    [
      source,
      canShowApiTesting,
      setShowTesting,
      blockStyle,
      noReport,
      noCopy,
      collapsibleType,
      collapsibleResult,
      hasInnerCodeBlock,
      scrollable,
    ]
  )

  if (!source.length) {
    return <></>
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
              <div
                className={clsx(innerBorderClasses, innerBgColor, "relative")}
                ref={codeContainerRef}
              >
                {collapsibleType === "start" && (
                  <>
                    <CodeBlockCollapsibleButton
                      type={collapsibleType}
                      expandButtonLabel={expandButtonLabel}
                      className={innerBorderClasses}
                      {...collapsibleResult}
                    />
                    <CodeBlockCollapsibleFade
                      type={collapsibleType}
                      collapsed={collapsibleResult.collapsed}
                      hasHeader={hasInnerCodeBlock}
                    />
                  </>
                )}
                <pre
                  style={{ ...style, fontStretch: "100%" }}
                  className={clsx(
                    "relative !my-0 break-words bg-transparent !outline-none",
                    "overflow-auto break-words p-0 pr-docs_0.25",
                    "rounded-docs_DEFAULT",
                    !hasInnerCodeBlock &&
                      tokens.length <= 1 &&
                      "px-docs_0.5 py-[6px]",
                    !title.length && (!noCopy || !noReport) && "xs:max-w-[83%]",
                    noLineNumbers && "pl-docs_1",
                    preClassName
                  )}
                >
                  <code
                    className={clsx(
                      "text-code-body font-monospace table min-w-full print:whitespace-pre-wrap",
                      tokens.length > 1 && "py-docs_0.75",
                      tokens.length <= 1 && "!py-[6px] px-docs_0.5"
                    )}
                    ref={codeRef}
                  >
                    {collapsibleType === "start" &&
                      getCollapsedLinesElm({
                        tokens,
                        highlightProps: rest,
                      })}
                    {getNonCollapsedLinesElm({
                      tokens,
                      highlightProps: rest,
                    })}
                    {collapsibleType === "end" &&
                      getCollapsedLinesElm({
                        tokens,
                        highlightProps: rest,
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
                {collapsibleType === "end" && (
                  <>
                    <CodeBlockCollapsibleFade
                      type={collapsibleType}
                      collapsed={collapsibleResult.collapsed}
                      hasHeader={hasInnerCodeBlock}
                    />
                    <CodeBlockCollapsibleButton
                      type={collapsibleType}
                      expandButtonLabel={expandButtonLabel}
                      className={innerBorderClasses}
                      {...collapsibleResult}
                    />
                  </>
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
