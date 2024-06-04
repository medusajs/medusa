"use client"

import {
  LineInputProps,
  LineOutputProps,
  Token,
  TokenInputProps,
  TokenOutputProps,
} from "prism-react-renderer"
import React, { useCallback, useMemo } from "react"
import { CodeBlockCollapsibleLines } from "../../components/CodeBlock/Collapsible/Lines"
import { useCollapsible } from "../use-collapsible"

export type HighlightProps = {
  getLineProps: (input: LineInputProps) => LineOutputProps
  getTokenProps: (input: TokenInputProps) => TokenOutputProps
}

export type CollapsibleCodeLines = {
  collapsibleLinesStr?: string
  getLines: (
    token: Token[][],
    highlightProps: HighlightProps,
    lineNumberOffset?: number
  ) => React.ReactNode
}

export type CollapsedCodeLinesPosition = "start" | "end"

export const useCollapsibleCodeLines = ({
  collapsibleLinesStr,
  getLines,
}: CollapsibleCodeLines) => {
  const collapsedRange:
    | {
        start: number
        end: number
      }
    | undefined = useMemo(() => {
    if (!collapsibleLinesStr) {
      return
    }

    const splitCollapsedLines = collapsibleLinesStr
      .split("-")
      .map((lineNumber) => parseInt(lineNumber))

    if (
      splitCollapsedLines.length !== 2 ||
      (splitCollapsedLines[0] !== 1 && splitCollapsedLines[1] < 2)
    ) {
      return
    }

    return {
      start: splitCollapsedLines[0],
      end: splitCollapsedLines[1],
    }
  }, [collapsibleLinesStr])

  const type: CollapsedCodeLinesPosition | undefined = useMemo(() => {
    if (!collapsedRange) {
      return undefined
    }
    return collapsedRange.start === 1 ? "start" : "end"
  }, [collapsedRange])

  const collapsibleHookResult = useCollapsible({
    unmountOnExit: false,
    translateEnabled: false,
    heightAnimation: true,
  })

  const getCollapsedLinesElm = useCallback(
    ({
      tokens,
      highlightProps,
    }: {
      tokens: Token[][]
      highlightProps: HighlightProps
    }) => {
      if (!collapsedRange || !type) {
        return <></>
      }

      const startIndex =
        type === "start" ? collapsedRange.start - 1 : collapsedRange.start

      const lines = tokens.slice(
        startIndex,
        Math.min(collapsedRange.end, tokens.length)
      )

      return (
        <CodeBlockCollapsibleLines {...collapsibleHookResult} type={type}>
          {getLines(lines, highlightProps, startIndex)}
        </CodeBlockCollapsibleLines>
      )
    },
    [collapsedRange, collapsibleHookResult]
  )

  const getNonCollapsedLinesElm = useCallback(
    ({
      tokens,
      highlightProps,
    }: {
      tokens: Token[][]
      highlightProps: HighlightProps
    }) => {
      if (!collapsedRange) {
        return getLines(tokens, highlightProps)
      }

      const isCollapseBeginning = collapsedRange.start === 1
      const lines = tokens.slice(
        isCollapseBeginning ? collapsedRange.end : 0,
        isCollapseBeginning ? undefined : collapsedRange.start
      )

      return getLines(
        lines,
        highlightProps,
        isCollapseBeginning ? collapsedRange.end : 0
      )
    },
    [collapsedRange, collapsibleHookResult]
  )

  return {
    getCollapsedLinesElm,
    getNonCollapsedLinesElm,
    type,
    ...collapsibleHookResult,
  }
}
