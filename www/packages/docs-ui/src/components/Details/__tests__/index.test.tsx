import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { CollapsibleProps } from "../../../hooks/use-collapsible"

// mock hooks
const mockSetCollapsed = vi.fn()
const mockGetCollapsibleElms = vi.fn(
  (children: React.ReactNode): React.ReactNode => children
)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseCollapsible = vi.fn((_options: CollapsibleProps) => ({
  getCollapsibleElms: mockGetCollapsibleElms,
  setCollapsed: mockSetCollapsed,
}))

// mock components
vi.mock("@/hooks/use-collapsible", () => ({
  useCollapsible: (options: CollapsibleProps) => mockUseCollapsible(options),
}))

vi.mock("@/components/Loading", () => ({
  Loading: ({ className }: { className?: string }) => (
    <div data-testid="loading" className={className}>
      Loading...
    </div>
  ),
}))

vi.mock("@/components/Details/Summary", () => ({
  DetailsSummary: ({ title, onClick }: DetailsSummaryProps) => (
    <summary data-testid="details-summary-title" onClick={onClick}>
      {title}
    </summary>
  ),
}))

// Mock Suspense to avoid act warnings - render children directly
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof React>("react")
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

import { Details } from "../../Details"
import { DetailsSummary, DetailsSummaryProps } from "../Summary"

beforeEach(() => {
  mockUseCollapsible.mockClear()
  mockUseCollapsible.mockReturnValue({
    getCollapsibleElms: mockGetCollapsibleElms,
    setCollapsed: mockSetCollapsed,
  })
  mockSetCollapsed.mockClear()
  mockGetCollapsibleElms.mockImplementation(
    (children: React.ReactNode): React.ReactNode => children
  )
})

describe("rendering", () => {
  test("renders details element", () => {
    const { container } = render(
      <Details>
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    expect(details).toBeInTheDocument()
    expect(details).toHaveTextContent("Content")
  })

  test("renders with summaryContent", () => {
    const { container } = render(
      <Details summaryContent="Summary Title">
        <div>Content</div>
      </Details>
    )
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const title = container.querySelector(
      "[data-testid='details-summary-title']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Summary Title")
  })

  test("renders with summaryElm", () => {
    const summaryElm = <DetailsSummary title="Custom Summary" />
    const { container } = render(
      <Details summaryElm={summaryElm}>
        <div>Content</div>
      </Details>
    )
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const title = container.querySelector(
      "[data-testid='details-summary-title']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Custom Summary")
  })

  test("renders with className", () => {
    const { container } = render(
      <Details className="custom-class">
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    expect(details).toHaveClass("custom-class")
  })
})

describe("initial state", () => {
  test("renders closed by default when openInitial is false", () => {
    const { container } = render(
      <Details openInitial={false}>
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    expect(details).not.toHaveAttribute("open")
  })

  test("renders open when openInitial is true", () => {
    const { container } = render(
      <Details openInitial={true}>
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    expect(details).toHaveAttribute("open")
  })

  test("passes correct initialValue to useCollapsible when openInitial is false", () => {
    render(
      <Details openInitial={false}>
        <div>Content</div>
      </Details>
    )
    expect(mockUseCollapsible).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: true, // !openInitial = !false = true
      })
    )
  })

  test("passes correct initialValue to useCollapsible when openInitial is true", () => {
    render(
      <Details openInitial={true}>
        <div>Content</div>
      </Details>
    )
    expect(mockUseCollapsible).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: false, // !openInitial = !true = false
      })
    )
  })
})

describe("height animation", () => {
  test("passes heightAnimation to useCollapsible when true", () => {
    render(
      <Details heightAnimation={true}>
        <div>Content</div>
      </Details>
    )
    expect(mockUseCollapsible).toHaveBeenCalledWith(
      expect.objectContaining({
        heightAnimation: true,
      })
    )
  })

  test("passes heightAnimation to useCollapsible when false", () => {
    render(
      <Details heightAnimation={false}>
        <div>Content</div>
      </Details>
    )
    expect(mockUseCollapsible).toHaveBeenCalledWith(
      expect.objectContaining({
        heightAnimation: false,
      })
    )
  })
})

describe("interactions", () => {
  test("toggles open state when summary is clicked", () => {
    const { container } = render(
      <Details summaryContent="Summary">
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    const summary = container.querySelector("summary")
    expect(details).not.toHaveAttribute("open")

    fireEvent.click(summary!)
    expect(details).toHaveAttribute("open")
    expect(mockSetCollapsed).toHaveBeenCalledWith(false)
  })

  test("closes when summary is clicked and already open", () => {
    mockUseCollapsible.mockReturnValue({
      getCollapsibleElms: mockGetCollapsibleElms,
      setCollapsed: mockSetCollapsed,
    })
    const { container } = render(
      <Details summaryContent="Summary" openInitial={true}>
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    const summary = container.querySelector("summary")
    expect(details).toHaveAttribute("open")

    fireEvent.click(summary!)
    expect(mockSetCollapsed).toHaveBeenCalledWith(true)
  })

  test("prevents default on details click", () => {
    const { container } = render(
      <Details summaryContent="Summary">
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault")

    fireEvent(details!, clickEvent)
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  test("stops propagation on toggle event", () => {
    const { container } = render(
      <Details summaryContent="Summary">
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    const toggleEvent = new Event("toggle", { bubbles: true, cancelable: true })
    const stopPropagationSpy = vi.spyOn(toggleEvent, "stopPropagation")

    fireEvent(details!, toggleEvent)
    expect(stopPropagationSpy).toHaveBeenCalled()
  })

  test("navigates to link when link is clicked in summary", () => {
    const originalLocation = window.location
    delete (window as unknown as { location?: Location }).location
    Object.defineProperty(window, "location", {
      value: { href: "http://localhost" },
      writable: true,
      configurable: true,
    })

    const { container } = render(
      <Details summaryContent={<a href="/test">Link</a>}>
        <div>Content</div>
      </Details>
    )
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()

    fireEvent.click(link!)
    expect(window.location.href).toBe("/test")

    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    })
  })

  test("does not toggle when code element is clicked", () => {
    const { container } = render(
      <Details summaryContent={<code>Code</code>}>
        <div>Content</div>
      </Details>
    )
    const details = container.querySelector("details")
    const code = container.querySelector("code")
    expect(details).not.toHaveAttribute("open")

    mockSetCollapsed.mockClear()
    fireEvent.click(code!)
    // Should not toggle when code is clicked
    expect(mockSetCollapsed).not.toHaveBeenCalled()
  })
})

describe("summary element cloning", () => {
  test("clones summaryElm with open and onClick props", () => {
    const summaryElm = <DetailsSummary title="Custom Summary" />
    const { container } = render(
      <Details summaryElm={summaryElm} openInitial={true}>
        <div>Content</div>
      </Details>
    )
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    // The cloned element should receive open prop
    const title = container.querySelector(
      "[data-testid='details-summary-title']"
    )
    expect(title).toBeInTheDocument()
  })

  test("clones summaryElm with onClick handler", () => {
    const summaryElm = <DetailsSummary title="Custom Summary" />
    const { container } = render(
      <Details summaryElm={summaryElm}>
        <div>Content</div>
      </Details>
    )
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()

    fireEvent.click(summary!)
    expect(mockSetCollapsed).toHaveBeenCalled()
  })
})

describe("collapsible integration", () => {
  test("calls onClose callback when collapsed", () => {
    mockUseCollapsible.mockReturnValue({
      getCollapsibleElms: mockGetCollapsibleElms,
      setCollapsed: mockSetCollapsed,
    })

    render(
      <Details summaryContent="Summary">
        <div>Content</div>
      </Details>
    )

    expect(mockUseCollapsible).toHaveBeenCalledWith(
      expect.objectContaining({
        onClose: expect.any(Function),
      })
    )
  })
})
