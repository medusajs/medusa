import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { MenuItem, OpenAPI } from "types"

// mock data
const mockEvents: OpenAPI.OasEvents[] = [
  {
    name: "event1",
    payload: "payload1",
    description: "description1",
  },
]

// mock functions
const mockParseEventPayload = vi.fn((payload: string) => {
  return {
    parsed_payload: payload,
    payload_for_snippet: payload,
  }
})
const mockHandleCopy = vi.fn()
const mockUseCopied = vi.fn((options: unknown) => ({
  handleCopy: mockHandleCopy,
  isCopied: false,
}))
const mockUseGenerateSnippet = vi.fn((options: unknown) => ({
  snippet: "snippet",
}))

// mock components
vi.mock("docs-ui", () => ({
  Badge: ({ 
    variant, 
    children,
    ...props
  }: { variant: string, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="badge" data-variant={variant} {...props}>{children}</div>
  ),
  DetailsSummary: ({ title, subtitle }: { title: string, subtitle: React.ReactNode }) => (
    <div data-testid="details-summary" data-title={title}>{title}</div>
  ),
  DropdownMenu: ({ 
    dropdownButtonContent, 
    menuItems
  }: { dropdownButtonContent: React.ReactNode, menuItems: MenuItem[] }) => (
    <div data-testid="dropdown-menu">
      <div data-testid="dropdown-button">{dropdownButtonContent}</div>
      <div data-testid="dropdown-menu-items">
        {menuItems.map((item, index) => (
          <div key={index} data-testid={"dropdown-menu-item"} onClick={() => {
            if ("action" in item) {
              item.action()
            }
          }}>
            {"title" in item && item.title}
          </div>
        ))}
      </div>
    </div>
  ),
  Link: ({ href, children }: { href: string, children: React.ReactNode }) => (
    <div data-testid="link" data-href={href}>{children}</div>
  ),
  MarkdownContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="markdown-content">{children}</div>
  ),
  parseEventPayload: (payload: string) => mockParseEventPayload(payload),
  Tabs: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs">{children}</div>
  ),
  TabsContent: ({ value, children }: { value: string, children: React.ReactNode }) => (
    <div data-testid="tabs-content" data-value={value}>{children}</div>
  ),
  TabsContentWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-content-wrapper">{children}</div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ value, children }: { value: string, children: React.ReactNode }) => (
    <div data-testid="tabs-trigger" data-value={value}>{children}</div>
  ),
  Tooltip: ({ 
    text,
    children,
    ...props
  }: { text: string, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="tooltip" data-text={text} {...props}>{children}</div>
  ),
  useCopy: (options: unknown) => mockUseCopied(options),
  useGenerateSnippet: (options: unknown) => mockUseGenerateSnippet(options),
}))
vi.mock("@/components/Tags/Operation/Parameters", () => ({
  default: () => <div data-testid="parameters">Parameters</div>,
}))
vi.mock("@medusajs/icons", () => ({
  CheckCircle: () => <div data-testid="check-circle">CheckCircle</div>,
  SquareTwoStack: () => <div data-testid="square-two-stack">SquareTwoStack</div>,
  Tag: () => <div data-testid="tag">Tag</div>,
  Brackets: () => <div data-testid="brackets">Brackets</div>,
}))

import TagsOperationDescriptionSectionEvents from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders events", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionEvents events={mockEvents} />
    )
    const detailsSummaryElement = container.querySelector("[data-testid='details-summary']")
    expect(detailsSummaryElement).toBeInTheDocument()
    expect(detailsSummaryElement).toHaveAttribute("data-title", "Emitted Events")

    const tabsElement = container.querySelector("[data-testid='tabs']")
    expect(tabsElement).toBeInTheDocument()

    const tabsContentElement = tabsElement!.querySelectorAll("[data-testid='tabs-content']")
    expect(tabsContentElement).toHaveLength(mockEvents.length)
    expect(tabsContentElement[0]).toHaveAttribute("data-value", mockEvents[0].name)
    expect(tabsContentElement[0]).toHaveTextContent(mockEvents[0].description!)

    const deprecatedBadge = tabsContentElement[0].querySelector("[data-testid='deprecated-badge']")
    expect(deprecatedBadge).not.toBeInTheDocument()
    
    const sinceBadge = tabsContentElement[0].querySelector("[data-testid='since-badge']")
    expect(sinceBadge).not.toBeInTheDocument()

    const parameters = tabsContentElement[0].querySelector("[data-testid='parameters']")
    expect(parameters).toBeInTheDocument()
  })

  test("renders deprecated badge without tooltip when event is deprecated and does not have a deprecated message", () => {
    const modifiedEvents: OpenAPI.OasEvents[] = [
      {
        ...mockEvents[0],
        deprecated: true,
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionEvents events={modifiedEvents} />
    )
    const deprecatedBadge = container.querySelector("[data-testid='deprecated-badge']")
    expect(deprecatedBadge).toBeInTheDocument()
    expect(deprecatedBadge).toHaveAttribute("data-variant", "orange")
    expect(deprecatedBadge).toHaveTextContent("Deprecated")
    const deprecatedTooltip = container.querySelector("[data-testid='deprecated-tooltip']")
    expect(deprecatedTooltip).not.toBeInTheDocument()
  })

  test("renders deprecated badge with tooltip when event is deprecated and has a deprecated message", () => {
    const modifiedEvents: OpenAPI.OasEvents[] = [
      {
        ...mockEvents[0],
        deprecated: true,
        deprecated_message: "This event is deprecated",
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionEvents events={modifiedEvents} />
    )
    const deprecatedBadge = container.querySelector("[data-testid='deprecated-badge']")
    expect(deprecatedBadge).toBeInTheDocument()
    expect(deprecatedBadge).toHaveAttribute("data-variant", "orange")
    expect(deprecatedBadge).toHaveTextContent("Deprecated")
    const deprecatedTooltip = container.querySelector("[data-testid='deprecated-tooltip']")
    expect(deprecatedTooltip).toBeInTheDocument()
    expect(deprecatedTooltip).toHaveAttribute("data-text", "This event is deprecated")
  })

  test("renders since badge when event has a since version", () => {
    const modifiedEvents: OpenAPI.OasEvents[] = [
      {
        ...mockEvents[0],
        since: "1.0.0",
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionEvents events={modifiedEvents} />
    )
    const sinceBadge = container.querySelector("[data-testid='since-badge']")
    expect(sinceBadge).toBeInTheDocument()
    expect(sinceBadge).toHaveAttribute("data-variant", "blue")
    expect(sinceBadge).toHaveTextContent("v1.0.0")
    const sinceTooltip = container.querySelector("[data-testid='since-tooltip']")
    expect(sinceTooltip).toBeInTheDocument()
    expect(sinceTooltip).toHaveAttribute("data-text", "This event is emitted since v1.0.0")
  })

  test("renders SquareTwoStack icon when event name and snippet are not copied", () => {
    mockUseCopied.mockReturnValue({
      handleCopy: mockHandleCopy,
      isCopied: false,
    })
    const { container } = render(
      <TagsOperationDescriptionSectionEvents events={mockEvents} />
    )
    const squareTwoStackIcon = container.querySelector("[data-testid='square-two-stack']")
    expect(squareTwoStackIcon).toBeInTheDocument()
    const checkCircleIcon = container.querySelector("[data-testid='check-circle']")
    expect(checkCircleIcon).not.toBeInTheDocument()
  })

  test("renders CheckCircle icon when event name and snippet are copied", () => {
    mockUseCopied.mockReturnValue({
      handleCopy: mockHandleCopy,
      isCopied: true,
    })
    const { container } = render(
      <TagsOperationDescriptionSectionEvents events={mockEvents} />
    )
    const checkCircleIcon = container.querySelector("[data-testid='check-circle']")
    expect(checkCircleIcon).toBeInTheDocument()
    const squareTwoStackIcon = container.querySelector("[data-testid='square-two-stack']")
    expect(squareTwoStackIcon).not.toBeInTheDocument()
  })
})

describe("interactions", () => {
  test("copies event name when copy button is clicked", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionEvents events={mockEvents} />
    )
    expect(mockUseCopied).toHaveBeenCalledWith(mockEvents[0].name)
    const dropdownMenuItems = container.querySelectorAll("[data-testid='dropdown-menu-item']")
    expect(dropdownMenuItems).toHaveLength(2)
    fireEvent.click(dropdownMenuItems[0]!)
    expect(mockHandleCopy).toHaveBeenCalledTimes(1)
  })

  test("copies subscriber for event when copy button is clicked", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionEvents events={mockEvents} />
    )
    expect(mockUseCopied).toHaveBeenCalledWith("snippet")
    const dropdownMenuItems = container.querySelectorAll("[data-testid='dropdown-menu-item']")
    expect(dropdownMenuItems).toHaveLength(2)
    fireEvent.click(dropdownMenuItems[1]!)
    expect(mockHandleCopy).toHaveBeenCalledTimes(1)
  })
})