"use client"

import {
  LineInputProps,
  LineOutputProps,
  Token,
  TokenInputProps,
  TokenOutputProps,
} from "prism-react-renderer"
import React, { useCallback, useMemo } from "react"
import {
  CodeBlockCollapsibleLines,
  CodeBlockCollapsibleLinesProps,
} from "../../components/CodeBlock/CollapsibleLines"

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
  collapsibleLinesProps?: Omit<
    CodeBlockCollapsibleLinesProps,
    "children" | "type"
  >
}

export const useCollapsibleCodeLines = ({
  collapsibleLinesStr,
  getLines,
  collapsibleLinesProps = {},
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

  const getCollapsedLinesElm = useCallback(
    ({
      tokens,
      type,
      highlightProps,
    }: {
      tokens: Token[][]
      type: "start" | "end"
      highlightProps: HighlightProps
    }) => {
      if (
        !collapsedRange ||
        (type === "start" && collapsedRange.start !== 1) ||
        (type === "end" && collapsedRange.end !== tokens.length)
      ) {
        return <></>
      }

      const startIndex =
        type === "start" ? collapsedRange.start - 1 : collapsedRange.start

      const lines = tokens.slice(
        startIndex,
        Math.min(collapsedRange.end, tokens.length)
      )

      return (
        <CodeBlockCollapsibleLines {...collapsibleLinesProps} type={type}>
          {getLines(lines, highlightProps, startIndex)}
        </CodeBlockCollapsibleLines>
      )
    },
    [collapsedRange]
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
    [collapsedRange]
  )

  return {
    getCollapsedLinesElm,
    getNonCollapsedLinesElm,
  }
}
