import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { Type } from "../../.."

// mock functions
const mockScrollIntoView = vi.fn()

// mock hooks
const mockPathname = "/test-path"

const defaultUseSiteConfigReturn = {
  config: {
    baseUrl: "https://docs.medusajs.com",
    basePath: "/docs",
  },
}

const defaultUseIsBrowserReturn = {
  isBrowser: true,
}

const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)
const mockUseIsBrowser = vi.fn(() => defaultUseIsBrowserReturn)
const mockUsePathname = vi.fn(() => mockPathname)

vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => mockUseIsBrowser(),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

// mock utilities
vi.mock("@/utils/decode-str", () => ({
  decodeStr: (str: string) => str,
}))

vi.mock("@/utils/is-in-view", () => ({
  isInView: vi.fn(() => false),
}))

// mock components
vi.mock("@/components/Details", () => ({
  Details: ({
    summaryElm,
    children,
    className,
    openInitial,
  }: {
    summaryElm: React.ReactNode
    children: React.ReactNode
    className?: string
    openInitial?: boolean
  }) => (
    <details open={openInitial} className={className} data-testid="details">
      <summary>{summaryElm}</summary>
      {children}
    </details>
  ),
}))

vi.mock("@/components/Details/Summary", () => ({
  DetailsSummary: ({
    children,
    subtitle,
    expandable,
    className,
    onClick,
    id,
    summaryRef,
  }: {
    children: React.ReactNode
    subtitle?: React.ReactNode
    expandable?: boolean
    className?: string
    onClick?: (e: React.MouseEvent) => void
    id?: string
    summaryRef?: React.RefObject<HTMLDivElement>
  }) => (
    <div
      className={className}
      onClick={onClick}
      id={id}
      data-testid="details-summary"
      data-expandable={expandable}
      ref={summaryRef}
    >
      {children}
      {subtitle && <div data-testid="subtitle">{subtitle}</div>}
    </div>
  ),
}))

vi.mock("@/components/CopyButton", () => ({
  CopyButton: ({
    text,
    children,
    onCopy,
  }: {
    text: string
    children: React.ReactNode
    onCopy?: (e: React.MouseEvent) => void
  }) => (
    <button onClick={onCopy} data-testid="copy-button" data-text={text}>
      {children}
    </button>
  ),
}))

vi.mock("@/components/InlineCode", () => ({
  InlineCode: ({ children, ...props }: { children: React.ReactNode }) => (
    <code data-testid="inline-code" {...props}>
      {children}
    </code>
  ),
}))

vi.mock("@/components/MarkdownContent", () => ({
  MarkdownContent: ({
    children,
    allowedElements,
  }: {
    children: React.ReactNode
    allowedElements?: string[]
  }) => (
    <div
      data-testid="markdown-content"
      data-allowed={allowedElements?.join(",")}
    >
      {children}
    </div>
  ),
}))

vi.mock("@/components/Notices/ExpandableNotice", () => ({
  ExpandableNotice: ({
    type,
    link,
    badgeContent,
  }: {
    type: string
    link: string
    badgeContent: React.ReactNode
  }) => (
    <div data-testid="expandable-notice" data-type={type} data-link={link}>
      {badgeContent}
    </div>
  ),
}))

vi.mock("@/components/Notices/FeatureFlagNotice", () => ({
  FeatureFlagNotice: ({
    featureFlag,
    type,
    badgeContent,
  }: {
    featureFlag: string
    type: string
    badgeContent: React.ReactNode
  }) => (
    <div
      data-testid="feature-flag-notice"
      data-feature-flag={featureFlag}
      data-type={type}
    >
      {badgeContent}
    </div>
  ),
}))

vi.mock("@/components/Notices/VersionNotice", () => ({
  VersionNotice: ({ version }: { version: string }) => (
    <div data-testid="version-notice" data-version={version}>
      Version
    </div>
  ),
}))

vi.mock("@/components/Notices/DeprecatedNotice", () => ({
  DeprecatedNotice: ({ description }: { description?: string }) => (
    <div data-testid="deprecated-notice" data-description={description}>
      Deprecated
    </div>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  TriangleRightMini: ({ className }: { className?: string }) => (
    <svg data-testid="triangle-right-icon" className={className} />
  ),
  ArrowDownLeftMini: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-down-left-icon" className={className} />
  ),
  ArrowsPointingOutMini: () => <svg data-testid="arrows-pointing-out-icon" />,
  FlagMini: () => <svg data-testid="flag-icon" />,
  Link: ({ className }: { className?: string }) => (
    <svg data-testid="link-icon" className={className} />
  ),
}))
vi.mock("@/components/MDXComponents", () => ({
  MDXComponents: {
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol data-testid="mdx-component-ol" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li data-testid="mdx-component-li" {...props}>
        {children}
      </li>
    ),
  },
}))

beforeEach(() => {
  // Mock scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView
  vi.clearAllMocks()
  mockUseSiteConfig.mockReturnValue(defaultUseSiteConfigReturn)
  mockUseIsBrowser.mockReturnValue(defaultUseIsBrowserReturn)
  mockUsePathname.mockReturnValue(mockPathname)
  window.location.hash = ""
})

import TypeListItems from "../../Items"

describe("rendering", () => {
  test("renders type item without children", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toBeInTheDocument()
  })

  test("renders type name", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const inlineCode = container.querySelector("[data-testid='type-name']")
    expect(inlineCode).toHaveTextContent("test")
  })

  test("renders type type", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const typeType = container.querySelector("[data-testid='type-type']")
    expect(typeType).toBeInTheDocument()
    expect(typeType).toHaveTextContent("string")
  })

  test("renders optional badge when optional is true", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      optional: true,
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const optionalBadge = container.querySelector(
      "[data-testid='type-optional']"
    )
    expect(optionalBadge).toBeInTheDocument()
    expect(optionalBadge).toHaveTextContent("Optional")
  })

  test("renders description in subtitle", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      description: "Test description",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const subtitle = container.querySelector("[data-testid='subtitle']")
    expect(subtitle).toBeInTheDocument()
    expect(subtitle).toHaveTextContent("Test description")
  })

  test("renders defaultValue in subtitle", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      defaultValue: "default",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const defaultValue = container.querySelector("[data-testid='subtitle']")
    expect(defaultValue).toBeInTheDocument()
    expect(defaultValue).toHaveTextContent("Default: default")
  })

  test("renders example in subtitle", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      example: "example",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const example = container.querySelector("[data-testid='subtitle']")
    expect(example).toBeInTheDocument()
    expect(example).toHaveTextContent("Example: example")
  })

  test("renders feature flag notice when featureFlag is provided", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      featureFlag: "test-flag",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const notice = container.querySelector(
      "[data-testid='feature-flag-notice']"
    )
    expect(notice).toBeInTheDocument()
    expect(notice).toHaveAttribute("data-feature-flag", "test-flag")
  })

  test("renders expandable notice when expandable is true", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
    }
    const { container } = render(
      <TypeListItems types={[typeItem]} expandUrl="/expand" />
    )
    const notice = container.querySelector("[data-testid='expandable-notice']")
    expect(notice).toBeInTheDocument()
    expect(notice).toHaveAttribute("data-link", "/expand")
  })

  test("renders version notice when since is provided", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      since: "1.0.0",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const notice = container.querySelector("[data-testid='version-notice']")
    expect(notice).toBeInTheDocument()
    expect(notice).toHaveAttribute("data-version", "1.0.0")
  })

  test("renders deprecated notice when deprecated is true", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      deprecated: {
        is_deprecated: true,
        description: "Deprecated description",
      },
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const notice = container.querySelector("[data-testid='deprecated-notice']")
    expect(notice).toBeInTheDocument()
    expect(notice).toHaveAttribute("data-description", "Deprecated description")
  })

  test("renders Details component when item has children", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const details = container.querySelector("[data-testid='details']")
    expect(details).toBeInTheDocument()
  })

  test("renders triangle icon when nested and has children", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const icon = container.querySelector("[data-testid='triangle-right-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders arrow icon when not nested and level > 1", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={2} />)
    const icon = container.querySelector("[data-testid='arrow-down-left-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders copy button when level is 1 and typeId exists", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: false,
    }
    const { container } = render(
      <TypeListItems types={[typeItem]} level={1} sectionTitle="Test Section" />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
  })

  test("generates typeId correctly with sectionTitle", () => {
    const typeItem: Type = {
      name: "test item",
      type: "string",
      expandable: false,
    }
    const { container } = render(
      <TypeListItems types={[typeItem]} sectionTitle="Test Section" />
    )
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toHaveAttribute("id", "#Test_Section-test_item-1-0")
  })

  test("does not generate typeId when sectionTitle is not provided", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} />)
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toHaveAttribute("id", "")
  })

  test("opens Details when openedLevel >= level", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(
      <TypeListItems types={[typeItem]} level={1} openedLevel={1} />
    )
    const details = container.querySelector("[data-testid='details']")
    expect(details).toHaveAttribute("open", "")
  })

  test("renders multiple type items", () => {
    const types: Type[] = [
      {
        name: "test1",
        type: "string",
        expandable: false,
      },
      {
        name: "test2",
        type: "number",
        expandable: false,
      },
    ]
    const { container } = render(<TypeListItems types={types} />)
    const summaries = container.querySelectorAll(
      "[data-testid='details-summary']"
    )
    expect(summaries).toHaveLength(2)
  })

  test("passes props to TypeListItem", () => {
    const types: Type[] = [
      {
        name: "test",
        type: "string",
        expandable: false,
      },
    ]
    const { container } = render(
      <TypeListItems types={types} sectionTitle="Test" level={2} />
    )
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toBeInTheDocument()
  })
})

describe("group classes based on level", () => {
  test("applies group/typeOne class to Details when level is 1", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={1} />)
    const details = container.querySelector("[data-testid='details']")
    expect(details).toHaveClass("group/typeOne")
  })

  test("applies group/typeTwo class to Details when level is 2", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={2} />)
    const details = container.querySelector("[data-testid='details']")
    expect(details).toHaveClass("group/typeTwo")
  })

  test("applies group/typeThree class to Details when level is 3", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={3} />)
    const details = container.querySelector("[data-testid='details']")
    expect(details).toHaveClass("group/typeThree")
  })

  test("applies group/typeFour class to Details when level is 4", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={4} />)
    const details = container.querySelector("[data-testid='details']")
    expect(details).toHaveClass("group/typeFour")
  })

  test("applies correct border classes to DetailsSummary when level is 1", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={1} />)
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toHaveClass("group-open/typeOne:border-solid")
    expect(summary).toHaveClass("group-open/typeOne:border-0")
    expect(summary).toHaveClass("group-open/typeOne:border-b")
  })

  test("applies correct border classes to DetailsSummary when level is 2", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={2} />)
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toHaveClass("group-open/typeTwo:border-solid")
    expect(summary).toHaveClass("group-open/typeTwo:border-0")
    expect(summary).toHaveClass("group-open/typeTwo:border-b")
  })

  test("applies correct border classes to DetailsSummary when level is 3", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={3} />)
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toHaveClass("group-open/typeThree:border-solid")
    expect(summary).toHaveClass("group-open/typeThree:border-0")
    expect(summary).toHaveClass("group-open/typeThree:border-b")
  })

  test("applies correct border classes to DetailsSummary when level is 4", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={4} />)
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toHaveClass("group-open/typeFour:border-solid")
    expect(summary).toHaveClass("group-open/typeFour:border-0")
    expect(summary).toHaveClass("group-open/typeFour:border-b")
  })

  test("applies correct rotate class to triangle icon when level is 1", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={1} />)
    const icon = container.querySelector("[data-testid='triangle-right-icon']")
    expect(icon).toHaveClass("group-open/typeOne:rotate-90")
  })

  test("applies correct rotate class to triangle icon when level is 2", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={2} />)
    const icon = container.querySelector("[data-testid='triangle-right-icon']")
    expect(icon).toHaveClass("group-open/typeTwo:rotate-90")
  })

  test("applies correct rotate class to triangle icon when level is 3", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={3} />)
    const icon = container.querySelector("[data-testid='triangle-right-icon']")
    expect(icon).toHaveClass("group-open/typeThree:rotate-90")
  })

  test("applies correct rotate class to triangle icon when level is 4", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: true,
      children: [
        {
          name: "child",
          type: "number",
          expandable: false,
        },
      ],
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={4} />)
    const icon = container.querySelector("[data-testid='triangle-right-icon']")
    expect(icon).toHaveClass("group-open/typeFour:rotate-90")
  })

  test("applies correct border classes to DetailsSummary when item has no children", () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: false,
    }
    const { container } = render(<TypeListItems types={[typeItem]} level={2} />)
    const summary = container.querySelector("[data-testid='details-summary']")
    expect(summary).toHaveClass("group-open/typeTwo:border-solid")
    expect(summary).toHaveClass("group-open/typeTwo:border-0")
    expect(summary).toHaveClass("group-open/typeTwo:border-b")
  })
})

describe("scroll behavior", () => {
  test("scrolls into view when hash matches typeId", async () => {
    const typeItem: Type = {
      name: "test",
      type: "string",
      expandable: false,
    }
    window.location.hash = "#Test_Section-test-1-0"
    render(<TypeListItems types={[typeItem]} sectionTitle="Test Section" />)
    await waitFor(() => {
      expect(mockScrollIntoView).toHaveBeenCalled()
    })
  })
})
