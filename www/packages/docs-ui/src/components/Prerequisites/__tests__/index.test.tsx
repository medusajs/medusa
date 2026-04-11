import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { CollapsibleProps } from "@/hooks/use-collapsible"
import { PrerequisiteItemType } from "../Item"

// mock hooks
const mockSetCollapsed = vi.fn()
const mockGetCollapsibleElms = vi.fn(
  (children: React.ReactNode): React.ReactNode => children
)
const mockUseCollapsible = vi.fn((_options: CollapsibleProps) => ({
  collapsed: false,
  getCollapsibleElms: mockGetCollapsibleElms,
  setCollapsed: mockSetCollapsed,
}))

// mock components
vi.mock("@/hooks/use-collapsible", () => ({
  useCollapsible: (options: CollapsibleProps) => mockUseCollapsible(options),
}))

vi.mock("@/components/Button", () => ({
  Button: ({
    className,
    variant,
    onClick,
    children,
  }: {
    className?: string
    variant?: string
    onClick?: () => void
    children: React.ReactNode
  }) => (
    <button
      className={className}
      data-variant={variant}
      onClick={onClick}
      data-testid="prerequisites-button"
    >
      {children}
    </button>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  TriangleRightMini: ({ className }: { className?: string }) => (
    <svg data-testid="triangle-icon" className={className} />
  ),
}))

vi.mock("@/components/Prerequisites/Item", () => ({
  PrerequisiteItem: ({
    item,
  }: {
    item: PrerequisiteItemType & { position?: string }
  }) => (
    <div data-testid="prerequisite-item" data-position={item.position}>
      {item.text}
    </div>
  ),
}))

import { Prerequisites } from "../../Prerequisites"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseCollapsible.mockReturnValue({
    collapsed: false,
    getCollapsibleElms: mockGetCollapsibleElms,
    setCollapsed: mockSetCollapsed,
  })
})

describe("rendering", () => {
  test("renders prerequisites component", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const details = container.querySelector("details")
    expect(details).toBeInTheDocument()
  })

  test("renders summary with button", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const button = container.querySelector(
      "[data-testid='prerequisites-button']"
    )
    expect(button).toBeInTheDocument()
  })

  test("renders prerequisites text and count", () => {
    const items: PrerequisiteItemType[] = [
      { text: "Item 1", link: "/item1" },
      { text: "Item 2", link: "/item2" },
    ]
    const { container } = render(<Prerequisites items={items} />)
    expect(container).toHaveTextContent("Prerequisites")
    expect(container).toHaveTextContent("2")
  })

  test("renders triangle icon", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const icon = container.querySelector("[data-testid='triangle-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders prerequisite items", () => {
    const items: PrerequisiteItemType[] = [
      { text: "Item 1", link: "/item1" },
      { text: "Item 2", link: "/item2" },
    ]
    const { container } = render(<Prerequisites items={items} />)
    const prerequisiteItems = container.querySelectorAll(
      "[data-testid='prerequisite-item']"
    )
    expect(prerequisiteItems).toHaveLength(2)
    expect(prerequisiteItems[0]).toHaveTextContent("Item 1")
    expect(prerequisiteItems[1]).toHaveTextContent("Item 2")
  })

  test("sets position to alone when single item", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const item = container.querySelector("[data-testid='prerequisite-item']")
    expect(item).toHaveAttribute("data-position", "alone")
  })

  test("sets position to top for first item", () => {
    const items: PrerequisiteItemType[] = [
      { text: "Item 1", link: "/item1" },
      { text: "Item 2", link: "/item2" },
    ]
    const { container } = render(<Prerequisites items={items} />)
    const itemsList = container.querySelectorAll(
      "[data-testid='prerequisite-item']"
    )
    expect(itemsList[0]).toHaveAttribute("data-position", "top")
  })

  test("sets position to middle for middle items", () => {
    const items: PrerequisiteItemType[] = [
      { text: "Item 1", link: "/item1" },
      { text: "Item 2", link: "/item2" },
      { text: "Item 3", link: "/item3" },
    ]
    const { container } = render(<Prerequisites items={items} />)
    const itemsList = container.querySelectorAll(
      "[data-testid='prerequisite-item']"
    )
    expect(itemsList[1]).toHaveAttribute("data-position", "middle")
  })

  test("sets position to bottom for last item", () => {
    const items: PrerequisiteItemType[] = [
      { text: "Item 1", link: "/item1" },
      { text: "Item 2", link: "/item2" },
    ]
    const { container } = render(<Prerequisites items={items} />)
    const itemsList = container.querySelectorAll(
      "[data-testid='prerequisite-item']"
    )
    expect(itemsList[1]).toHaveAttribute("data-position", "bottom")
  })

  test("rotates triangle icon when not collapsed", () => {
    mockUseCollapsible.mockReturnValue({
      collapsed: false,
      getCollapsibleElms: mockGetCollapsibleElms,
      setCollapsed: mockSetCollapsed,
    })
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const icon = container.querySelector("[data-testid='triangle-icon']")
    expect(icon).toHaveClass("rotate-90")
  })

  test("does not rotate triangle icon when collapsed", () => {
    mockUseCollapsible.mockReturnValue({
      collapsed: true,
      getCollapsibleElms: mockGetCollapsibleElms,
      setCollapsed: mockSetCollapsed,
    })
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const icon = container.querySelector("[data-testid='triangle-icon']")
    expect(icon).not.toHaveClass("rotate-90")
  })

  test("sets details open when not collapsed", () => {
    mockUseCollapsible.mockReturnValue({
      collapsed: false,
      getCollapsibleElms: mockGetCollapsibleElms,
      setCollapsed: mockSetCollapsed,
    })
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const details = container.querySelector("details")
    expect(details).toHaveAttribute("open")
  })

  test("sets details closed when collapsed", () => {
    mockUseCollapsible.mockReturnValue({
      collapsed: true,
      getCollapsibleElms: mockGetCollapsibleElms,
      setCollapsed: mockSetCollapsed,
    })
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const details = container.querySelector("details")
    expect(details).not.toHaveAttribute("open")
  })
})

describe("interactions", () => {
  test("calls setCollapsed when summary is clicked", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const summary = container.querySelector("summary")
    fireEvent.click(summary!)
    expect(mockSetCollapsed).toHaveBeenCalled()
  })

  test("prevents default when clicking on anchor element", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const details = container.querySelector("details")
    const anchor = document.createElement("a")
    const clickEvent = new MouseEvent("click", { bubbles: true })
    Object.defineProperty(clickEvent, "target", { value: anchor })
    fireEvent(details!, clickEvent)
    // Should not prevent default for anchor elements
    expect(details).toBeInTheDocument()
  })

  test("prevents default when clicking on details", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const details = container.querySelector("details")
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(clickEvent, "target", { value: details })
    fireEvent(details!, clickEvent)
    expect(details).toBeInTheDocument()
  })

  test("stops propagation on toggle event", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    const { container } = render(<Prerequisites items={items} />)
    const details = container.querySelector("details")
    const toggleEvent = new Event("toggle", { bubbles: true })
    const stopPropagationSpy = vi.spyOn(toggleEvent, "stopPropagation")
    fireEvent(details!, toggleEvent)
    expect(stopPropagationSpy).toHaveBeenCalled()
  })
})

describe("useCollapsible integration", () => {
  test("passes correct options to useCollapsible", () => {
    const items: PrerequisiteItemType[] = [{ text: "Item 1", link: "/item1" }]
    render(<Prerequisites items={items} />)
    expect(mockUseCollapsible).toHaveBeenCalledWith({
      initialValue: false,
      translateEnabled: false,
      childrenRef: expect.any(Object),
      useChild: false,
    })
  })
})
