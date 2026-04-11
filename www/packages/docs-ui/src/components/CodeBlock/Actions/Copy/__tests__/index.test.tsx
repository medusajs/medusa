import React, { useState } from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { CopyButtonProps } from "../../../../CopyButton"

// mock functions
const mockTrack = vi.fn()

// mock components
vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}))
vi.mock("@/components/CopyButton", () => ({
  CopyButton: ({
    text,
    buttonClassName,
    children,
    onCopy,
  }: CopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false)
    return (
      <div
        data-testid="copy-button"
        className={buttonClassName}
        onClick={(e) => {
          setIsCopied(true)
          onCopy?.(e)
        }}
      >
        {text}
        {typeof children === "function" ? children({ isCopied }) : children}
      </div>
    )
  },
}))

import { CodeBlockCopyAction } from ".."

beforeEach(() => {
  mockTrack.mockClear()
})

describe("rendering", () => {
  test("render code block copy action not in header", () => {
    const { container } = render(
      <CodeBlockCopyAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("[data-testid='copy-button']")
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass("p-[6px]")
  })

  test("render code block copy action in header", () => {
    const { container } = render(
      <CodeBlockCopyAction
        source="console.log('Hello, world!');"
        inHeader={true}
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("[data-testid='copy-button']")
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass("p-[4.5px]")
  })
})

describe("interactions", () => {
  test("click code block copy action", async () => {
    const { container } = render(
      <CodeBlockCopyAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("[data-testid='copy-button']")
    expect(span).toBeInTheDocument()
    fireEvent.click(span!)
    const copiedIcon = container.querySelector("[data-testid='copied-icon']")
    expect(copiedIcon).toBeInTheDocument()
  })
})
