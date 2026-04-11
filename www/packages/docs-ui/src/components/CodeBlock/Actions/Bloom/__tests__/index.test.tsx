import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock providers
const mockTrack = vi.fn()
vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}))

// mock components
vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({
    children,
    innerClassName,
    text,
  }: {
    children: React.ReactNode
    innerClassName: string
    text: string
  }) => (
    <div data-testid="tooltip" data-text={text}>
      {children} - {innerClassName}
    </div>
  ),
}))

vi.mock("@/components/Icons/Bloom", () => ({
  BloomIcon: () => <span data-testid="bloom-icon" />,
}))

import { CodeBlockBloomAction } from "../index"

beforeEach(() => {
  mockTrack.mockClear()
  vi.stubGlobal("window", {
    parent: {
      postMessage: vi.fn(),
    },
  })
})

describe("rendering", () => {
  test("renders code block bloom action in header", () => {
    const { container } = render(
      <CodeBlockBloomAction
        source="console.log('Hello, world!');"
        inHeader={true}
      />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute("data-text", "Send to Bloom")
    expect(tooltip).toHaveTextContent("flex")
    const span = tooltip?.querySelector("span")
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass("p-[4.5px]")
    expect(span).toHaveClass("cursor-pointer")
    const icon = span?.querySelector("[data-testid='bloom-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders code block bloom action not in header", () => {
    const { container } = render(
      <CodeBlockBloomAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    const span = tooltip?.querySelector("span")
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass("p-[6px]")
  })
})

describe("interactions", () => {
  test("posts message to parent window on click", () => {
    const source = "console.log('Hello, world!');"
    const { container } = render(
      <CodeBlockBloomAction source={source} inHeader={false} />
    )
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
    fireEvent.click(span!)
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      {
        type: "MEDUSA_AI_SEND_PROMPT",
        data: {
          prompt: source.trim(),
        },
      },
      "*"
    )
  })

  test("tracks bloom action on click", () => {
    const source = "console.log('Hello, world!');"
    const { container } = render(
      <CodeBlockBloomAction source={source} inHeader={false} />
    )
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
    fireEvent.click(span!)
    expect(mockTrack).toHaveBeenCalledWith({
      event: {
        event: "bloom_action",
        options: {
          type: "send_to_bloom",
          code: source.trim(),
        },
      },
    })
  })

  test("trims source code before sending", () => {
    const source = "\n\n  console.log('Hello, world!');  \n\n"
    const { container } = render(
      <CodeBlockBloomAction source={source} inHeader={false} />
    )
    const span = container.querySelector("span")
    fireEvent.click(span!)
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      {
        type: "MEDUSA_AI_SEND_PROMPT",
        data: {
          prompt: "console.log('Hello, world!');",
        },
      },
      "*"
    )
  })
})
