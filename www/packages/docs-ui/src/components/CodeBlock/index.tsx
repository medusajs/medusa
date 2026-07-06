"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import { Highlight, HighlightProps, themes, Token } from "prism-react-renderer"
import { ApiRunner } from "@/components/ApiRunner"
import { useAnalytics } from "@/providers/Analytics"
import { useColorMode } from "@/providers/ColorMode"
import { CodeBlockHeader, CodeBlockHeaderMeta } from "./Header"
import { CodeBlockLine } from "./Line"
import { ApiAuthType, ApiDataOptions, ApiMethod } from "types"
// @ts-expect-error can't install the types package because it doesn't support React v19
import { CSSTransition } from "react-transition-group"
import { DocsTrackingEvents } from "@/constants"
import { useCollapsibleCodeLines } from "@/hooks/use-collapsible-code-lines"
import { HighlightProps as CollapsibleHighlightProps } from "@/hooks/use-collapsible-code-lines"
import { CodeBlockActions, CodeBlockActionsProps } from "./Actions"
import { CodeBlockCollapsibleButton } from "./Collapsible/Button"
import { CodeBlockCollapsibleFade } from "./Collapsible/Fade"
import { CodeBlockInline } from "./Inline"

export type Highlight = {
  line: number
  text?: string
  tooltipText?: string
}

export type CodeBlockMetaFields = {
  title?: string
  hasTabs?: boolean
  npm2yarn?: boolean
  npx2yarn?: boolean
  npx2yarnExec?: boolean
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
  noAskAi?: boolean
  collapsibleLines?: string
  expandButtonLabel?: string
  isTerminal?: boolean
  forceNoTitle?: boolean
  collapsed?: boolean
  wrapperClassName?: string
} & CodeBlockHeaderMeta

export type CodeBlockStyle = "loud" | "subtle" | "inline"

export type CodeBlockProps = {
  source: string
  lang?: string
  innerClassName?: string
  className?: string
  blockStyle?: CodeBlockStyle
  children?: React.ReactNode
  style?: React.HTMLAttributes<HTMLDivElement>["style"]
  animateTokenHighlights?: boolean
  overrideColors?: {
    bg?: string
    innerBg?: string
    lineNumbersBg?: string
    border?: string
    innerBorder?: string
    boxShadow?: string
  }
} & CodeBlockMetaFields &
  Omit<HighlightProps, "code" | "language" | "children">

export const CodeBlock = ({
  source,
  hasTabs = false,
  lang = "",
  wrapperClassName,
  innerClassName,
  className,
  overrideColors = {},
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
  isTerminal,
  style,
  forceNoTitle = false,
  animateTokenHighlights,
  noAskAi = false,
  ...rest
}: CodeBlockProps) => {
  if (!source && typeof children === "string") {
    source = children
  }
  if (blockStyle === "inline") {
    return <CodeBlockInline source={source} />
  }

  const { colorMode } = useColorMode()
  const { track } = useAnalytics()
  const [showTesting, setShowTesting] = useState(false)
  const codeContainerRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const apiRunnerRef = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)
  const isTerminalCode = useMemo(() => {
    return isTerminal === undefined
      ? lang === "bash" && !source.startsWith("curl")
      : isTerminal
  }, [isTerminal, lang])
  const codeTitle = useMemo(() => {
    if (forceNoTitle) {
      return ""
    }

    if (title) {
      return title
    }

    if (hasTabs) {
      return ""
    }

    if (isTerminalCode) {
      return "Terminal"
    }

    return "Code"
  }, [title, isTerminalCode, hasTabs, forceNoTitle])
  const hasInnerCodeBlock = useMemo(
    () => hasTabs || codeTitle.length > 0,
    [hasTabs, codeTitle]
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
        overrideColors.bg,
        !overrideColors.bg && [
          blockStyle === "loud" && "bg-medusa-contrast-bg-base",
          blockStyle === "subtle" && "bg-medusa-bg-component",
        ]
      ),
    [blockStyle, colorMode, overrideColors]
  )

  const lineNumbersColor = useMemo(
    () =>
      clsx(
        overrideColors.lineNumbersBg,
        !overrideColors.lineNumbersBg && [
          blockStyle === "loud" && "text-medusa-contrast-fg-secondary",
          blockStyle === "subtle" && "text-medusa-fg-muted",
        ]
      ),
    [blockStyle, colorMode, overrideColors]
  )

  const borderColor = useMemo(
    () => clsx(overrideColors.border, !overrideColors.border && "border-0"),
    [blockStyle, colorMode, overrideColors]
  )

  const boxShadow = useMemo(
    () =>
      clsx(
        overrideColors.boxShadow,
        !overrideColors.boxShadow && [
          blockStyle === "loud" &&
            "shadow-elevation-code-block dark:shadow-elevation-code-block-dark",
          blockStyle === "subtle" && "shadow-none",
        ]
      ),
    [blockStyle, overrideColors]
  )

  const innerBgColor = useMemo(
    () =>
      clsx(
        overrideColors.innerBg,
        !overrideColors.innerBg && [
          blockStyle === "loud" && [
            hasInnerCodeBlock && "bg-medusa-contrast-bg-subtle",
            !hasInnerCodeBlock && "bg-medusa-contrast-bg-base",
          ],
          blockStyle === "subtle" && bgColor,
        ]
      ),
    [blockStyle, bgColor, hasInnerCodeBlock, overrideColors]
  )

  const innerBorderClasses = useMemo(
    () =>
      clsx(
        overrideColors.innerBorder,
        !overrideColors.innerBorder && [
          blockStyle === "loud" && [
            hasInnerCodeBlock &&
              "border border-solid border-medusa-contrast-border-bot rounded-docs_DEFAULT",
            !hasInnerCodeBlock && "border-transparent rounded-docs_DEFAULT",
          ],
          blockStyle === "subtle" && "border-transparent rounded-docs_DEFAULT",
        ]
      ),
    [blockStyle, hasInnerCodeBlock, overrideColors]
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
          isTerminal={isTerminalCode}
          animateTokenHighlights={animateTokenHighlights}
          codeBlockStyle={blockStyle}
          {...highlightProps}
        />
      )
    })

  const {
    getCollapsedLinesElm,
    getNonCollapsedLinesElm,
    type: collapsibleType,
    isCollapsible,
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

  const trackCopy = () => {
    track({
      event: {
        event: DocsTrackingEvents.CODE_BLOCK_COPY,
        options: {
          text: source.substring(0, 150),
        },
      },
    })
  }

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
      noAskAi,
    }),
    [
      source,
      canShowApiTesting,
      setShowTesting,
      noReport,
      noCopy,
      collapsibleType,
      collapsibleResult,
      hasInnerCodeBlock,
      scrollable,
      noAskAi,
    ]
  )

  const codeTheme = useMemo(() => {
    const prismTheme =
      blockStyle === "loud" || colorMode === "dark"
        ? themes.vsDark
        : themes.vsLight

    if (blockStyle === "subtle") {
      return prismTheme
    }

    return {
      ...prismTheme,
      plain: {
        ...prismTheme,
        color:
          colorMode === "light"
            ? "rgba(255, 255, 255, 0.88)"
            : "rgba(250, 250, 250, 1)",
      },
    }
  }, [blockStyle, colorMode])

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
          blockStyle === "loud" && "code-block-highlight",
          blockStyle === "subtle" && "code-block-highlight-light",
          wrapperClassName
        )}
        data-testid="code-block"
      >
        {codeTitle && (
          <CodeBlockHeader
            title={codeTitle}
            blockStyle={blockStyle}
            badgeLabel={rest.badgeLabel}
            badgeColor={rest.badgeColor}
            actionsProps={{
              ...actionsProps,
              inHeader: true,
            }}
            hideActions={hasTabs}
          />
        )}
        <div
          className={clsx(
            "relative mb-docs_1",
            "w-full max-w-full border code-block-elm",
            bgColor,
            borderColor,
            collapsed && "max-h-[400px] overflow-auto",
            hasInnerCodeBlock && "p-[5px] !pt-0 rounded-b-docs_lg",
            !hasInnerCodeBlock && "rounded-docs_DEFAULT",
            className
          )}
          style={style}
          data-testid="code-block-inner"
        >
          <Highlight
            theme={codeTheme}
            code={source.trim()}
            language={language}
            {...rest}
          >
            {({
              className: preClassName,
              style: { backgroundColor: _, ...style },
              tokens,
              ...rest
            }) => (
              <div
                className={clsx(
                  innerBorderClasses,
                  innerBgColor,
                  "relative",
                  innerClassName
                )}
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
                      "px-docs_1 py-[6px]",
                    (noLineNumbers ||
                      (tokens.length <= 1 && !isTerminalCode)) &&
                      "pl-docs_1",
                    preClassName
                  )}
                  onCopy={trackCopy}
                >
                  <code
                    className={clsx(
                      "text-code-body font-monospace table min-w-full print:whitespace-pre-wrap",
                      "py-docs_0.75"
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
                {!hasInnerCodeBlock &&
                  (!noCopy || !noReport || canShowApiTesting || !noAskAi) && (
                    <CodeBlockActions
                      {...actionsProps}
                      inHeader={false}
                      isSingleLine={tokens.length <= 1}
                    />
                  )}
                {collapsibleType === "end" && isCollapsible(tokens) && (
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
          nodeRef={apiRunnerRef}
        >
          <ApiRunner
            apiMethod={rest.testApiMethod!}
            apiUrl={rest.testApiUrl!}
            pathData={rest.testPathParams}
            bodyData={rest.testBodyParams}
            queryData={rest.testQueryParams}
            ref={apiRunnerRef}
          />
        </CSSTransition>
      )}
    </>
  )
}
