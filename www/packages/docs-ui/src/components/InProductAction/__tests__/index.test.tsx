import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock providers
const mockTrack = vi.fn()
const mockUseSiteConfig = vi.fn()

vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}))

vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
  ProductView: {
    BLOOM: "bloom",
  },
}))

// mock icons
vi.mock("@medusajs/icons", () => ({
  ArrowUpRightOnBox: () => <span data-testid="arrow-icon" />,
}))

import { InProductAction } from "../index"
import { ProductView } from "../../../providers/SiteConfig"

beforeEach(() => {
  mockTrack.mockClear()
  mockUseSiteConfig.mockReturnValue({
    productView: undefined,
  })
  vi.stubGlobal("window", {
    parent: {
      postMessage: vi.fn(),
    },
  })
})

describe("rendering", () => {
  test("renders children when productView does not match", () => {
    mockUseSiteConfig.mockReturnValue({
      productView: undefined,
    })
    const { container } = render(
      <InProductAction
        product={ProductView.BLOOM}
        renderType="default"
        type="test_action"
      >
        <span>Test Content</span>
      </InProductAction>
    )
    expect(container).toHaveTextContent("Test Content")
    expect(container.querySelector("[data-testid='arrow-icon']")).toBeNull()
  })

  test("renders interactive element when productView matches", () => {
    mockUseSiteConfig.mockReturnValue({
      productView: ProductView.BLOOM,
    })
    const { container } = render(
      <InProductAction
        product={ProductView.BLOOM}
        renderType="default"
        type="test_action"
      >
        <span>Test Content</span>
      </InProductAction>
    )
    expect(container).toHaveTextContent("Test Content")
    const icon = container.querySelector("[data-testid='arrow-icon']")
    expect(icon).toBeInTheDocument()
    const interactiveSpan = container.querySelector("span[tabindex]")
    expect(interactiveSpan).toBeInTheDocument()
    expect(interactiveSpan).toHaveClass("cursor-pointer")
    expect(interactiveSpan).toHaveClass("border-dashed")
  })

  test("applies correct classes when interactive", () => {
    mockUseSiteConfig.mockReturnValue({
      productView: ProductView.BLOOM,
    })
    const { container } = render(
      <InProductAction
        product={ProductView.BLOOM}
        renderType="default"
        type="test_action"
      >
        <span>Test Content</span>
      </InProductAction>
    )
    const interactiveSpan = container.querySelector("span[tabindex]")
    expect(interactiveSpan).toHaveClass(
      "border-b",
      "border-dashed",
      "border-medusa-fg-muted",
      "hover:border-medusa-fg-interactive",
      "font-medium",
      "transition-colors",
      "cursor-pointer",
      "inline-flex",
      "items-center",
      "gap-0.25"
    )
  })
})

describe("interactions", () => {
  test("posts message to parent window on click", () => {
    mockUseSiteConfig.mockReturnValue({
      productView: ProductView.BLOOM,
    })
    const type = "OPEN_SETTINGS"
    const data = { setting: "theme" }
    const { container } = render(
      <InProductAction
        product={ProductView.BLOOM}
        renderType="default"
        type={type}
        data={data}
      >
        <span>Settings</span>
      </InProductAction>
    )
    const interactiveSpan = container.querySelector("span[tabindex]")
    expect(interactiveSpan).toBeInTheDocument()
    fireEvent.click(interactiveSpan!)
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      {
        type,
        data,
      },
      "*"
    )
  })

  test("tracks bloom action on click", () => {
    mockUseSiteConfig.mockReturnValue({
      productView: ProductView.BLOOM,
    })
    const type = "OPEN_SETTINGS"
    const data = { setting: "theme", value: "dark" }
    const { container } = render(
      <InProductAction
        product={ProductView.BLOOM}
        renderType="default"
        type={type}
        data={data}
      >
        <span>Settings</span>
      </InProductAction>
    )
    const interactiveSpan = container.querySelector("span[tabindex]")
    fireEvent.click(interactiveSpan!)
    expect(mockTrack).toHaveBeenCalledWith({
      event: {
        event: "bloom_action",
        options: {
          type,
          setting: "theme",
          value: "dark",
        },
      },
    })
  })

  test("tracks action without data", () => {
    mockUseSiteConfig.mockReturnValue({
      productView: ProductView.BLOOM,
    })
    const type = "OPEN_HELP"
    const { container } = render(
      <InProductAction
        product={ProductView.BLOOM}
        renderType="default"
        type={type}
      >
        <span>Help</span>
      </InProductAction>
    )
    const interactiveSpan = container.querySelector("span[tabindex]")
    fireEvent.click(interactiveSpan!)
    expect(mockTrack).toHaveBeenCalledWith({
      event: {
        event: "bloom_action",
        options: {
          type,
        },
      },
    })
  })

  test("does not post message when productView does not match", () => {
    mockUseSiteConfig.mockReturnValue({
      productView: undefined,
    })
    const { container } = render(
      <InProductAction
        product={ProductView.BLOOM}
        renderType="default"
        type="test_action"
      >
        <span>Test Content</span>
      </InProductAction>
    )
    const content = container.querySelector("span")
    fireEvent.click(content!)
    expect(window.parent.postMessage).not.toHaveBeenCalled()
    expect(mockTrack).not.toHaveBeenCalled()
  })
})
