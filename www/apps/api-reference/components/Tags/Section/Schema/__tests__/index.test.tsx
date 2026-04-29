import React, { useState } from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor, fireEvent } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockSchema: OpenAPI.SchemaObject = {
  type: "object",
  properties: {
    name: { type: "string", properties: {} },
  },
}
const mockTagName = "mockTagName"

// mock functions
const mockIsElmWindow = vi.fn(() => false)
const mockUseIsBrowser = vi.fn(() => ({
  isBrowser: true,
}))
const mockScrollToElement = vi.fn()
const mockUseScrollController = vi.fn(() => ({
  scrollableElement: null as HTMLElement | null,
  scrollToElement: mockScrollToElement,
}))
const mockSetActivePath = vi.fn()
const mockUseSidebar = vi.fn(() => ({
  activePath: null as string | null,
  setActivePath: mockSetActivePath,
}))
const mockUseArea = vi.fn(() => ({
  displayedArea: "Store",
}))
const mockUseSchemaExample = vi.fn((_options: unknown) => ({
  examples: [
    {
      content: '{"name": "test"}',
    },
  ],
}))
const mockGetSectionId = vi.fn((options: unknown) => "mock-schema-slug")
const mockCheckElementInViewport = vi.fn(
  (_element: HTMLElement, _threshold: number) => true
)
const mockSingular = vi.fn((str: string) => str.replace(/s$/, ""))

// mock components
vi.mock("react-intersection-observer", () => ({
  InView: ({
    children,
    onChange,
    root,
    id,
  }: {
    children: React.ReactNode
    onChange: (inView: boolean, entry: IntersectionObserverEntry) => void
    root?: HTMLElement | null
    id?: string
  }) => {
    const [inView, setInView] = useState(false)
    const mockTarget = document.createElement("div")
    const mockEntry = {
      target: mockTarget,
      boundingClientRect: mockTarget.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: mockTarget.getBoundingClientRect(),
      isIntersecting: true,
      rootBounds: null,
      time: Date.now(),
    } as unknown as IntersectionObserverEntry

    return (
      <div data-testid="in-view" data-root={root?.tagName} id={id}>
        {children}
        <button
          type="button"
          data-testid="in-view-toggle-button"
          onClick={() => {
            const newInView = !inView
            setInView(newInView)
            onChange(newInView, mockEntry)
          }}
        >
          {inView.toString()}
        </button>
      </div>
    )
  },
}))
vi.mock("docs-ui", () => ({
  isElmWindow: () => mockIsElmWindow(),
  useIsBrowser: () => mockUseIsBrowser(),
  useScrollController: () => mockUseScrollController(),
  useSidebar: () => mockUseSidebar(),
  CodeBlock: ({
    source,
    lang,
    title,
    className,
    style,
  }: {
    source: string
    lang: string
    title?: string
    className?: string
    style?: React.CSSProperties
  }) => (
    <div
      data-testid="code-block"
      data-lang={lang}
      data-title={title}
      className={className}
      style={style}
    >
      {source}
    </div>
  ),
  Note: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="note">{children}</div>
  ),
  Link: ({
    href,
    children,
    variant,
  }: {
    href: string
    children: React.ReactNode
    variant?: string
  }) => (
    <a data-testid="link" href={href} data-variant={variant}>
      {children}
    </a>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters", () => ({
  default: ({
    schemaObject,
    topLevel,
  }: {
    schemaObject: OpenAPI.SchemaObject
    topLevel?: boolean
  }) => (
    <div
      data-testid="tag-operation-parameters"
      data-top-level={topLevel?.toString()}
    >
      {JSON.stringify(schemaObject)}
    </div>
  ),
}))
vi.mock("@/layouts/Divided", () => ({
  default: ({
    mainContent,
    codeContent,
  }: {
    mainContent: React.ReactNode
    codeContent: React.ReactNode
  }) => (
    <div data-testid="divided">
      <div data-testid="divided-main-content">{mainContent}</div>
      <div data-testid="divided-code-content">{codeContent}</div>
    </div>
  ),
}))
vi.mock("@/components/Section/Container", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-container">{children}</div>
  ),
}))
vi.mock("@/hooks/use-schema-example", () => ({
  default: (options: unknown) => mockUseSchemaExample(options),
}))
vi.mock("@/providers/area", () => ({
  useArea: () => mockUseArea(),
}))
vi.mock("@/utils/check-element-in-viewport", () => ({
  default: (element: HTMLElement, threshold: number) =>
    mockCheckElementInViewport(element, threshold),
}))
vi.mock("docs-utils", () => ({
  getSectionId: (options: unknown) => mockGetSectionId(options),
}))
vi.mock("pluralize", () => ({
  singular: (str: string) => mockSingular(str),
}))

import TagSectionSchema from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
  window.location.hash = ""
  // Reset mocks to default values
  mockIsElmWindow.mockReturnValue(false)
  mockUseIsBrowser.mockReturnValue({ isBrowser: true })
  mockUseScrollController.mockReturnValue({
    scrollableElement: null,
    scrollToElement: mockScrollToElement,
  })
  mockUseSidebar.mockReturnValue({
    activePath: null,
    setActivePath: mockSetActivePath,
  })
  mockUseArea.mockReturnValue({
    displayedArea: "Store",
  })
  mockUseSchemaExample.mockReturnValue({
    examples: [
      {
        content: '{"name": "test"}',
      },
    ],
  })
  mockGetSectionId.mockReturnValue("mock-schema-slug")
  mockCheckElementInViewport.mockReturnValue(true)
  mockSingular.mockImplementation((str: string) => str.replace(/s$/, ""))
})

describe("rendering", () => {
  test("renders InView wrapper with correct props", () => {
    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).toHaveAttribute("id", "mock-schema-slug")
  })

  test("renders SectionContainer", () => {
    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const sectionContainerElement = getByTestId("section-container")
    expect(sectionContainerElement).toBeInTheDocument()
  })

  test("renders DividedLayout with mainContent and codeContent", () => {
    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const dividedElement = getByTestId("divided")
    expect(dividedElement).toBeInTheDocument()
    expect(getByTestId("divided-main-content")).toBeInTheDocument()
    expect(getByTestId("divided-code-content")).toBeInTheDocument()
  })

  test("renders formatted name in heading", () => {
    mockSingular.mockReturnValue("mockTagNam")
    const { container } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const heading = container.querySelector("h2")
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent("mockTagNam Object")
  })

  test("renders Note with displayedArea", () => {
    mockUseArea.mockReturnValue({
      displayedArea: "Admin",
    })
    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const noteElement = getByTestId("note")
    expect(noteElement).toBeInTheDocument()
    expect(noteElement).toHaveTextContent("Admin")
  })

  test("renders Link to Commerce Modules Documentation", () => {
    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const linkElement = getByTestId("link")
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute(
      "href",
      "https://docs.medusajs.com/resources/commerce-modules"
    )
    expect(linkElement).toHaveTextContent("Commerce Modules Documentation")
  })

  test("renders Fields heading", () => {
    const { container } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const fieldsHeading = container.querySelector("h4")
    expect(fieldsHeading).toBeInTheDocument()
    expect(fieldsHeading).toHaveTextContent("Fields")
  })

  test("renders TagOperationParameters with schema and topLevel prop", () => {
    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const parametersElement = getByTestId("tag-operation-parameters")
    expect(parametersElement).toBeInTheDocument()
    expect(parametersElement).toHaveAttribute("data-top-level", "true")
    expect(parametersElement).toHaveTextContent(JSON.stringify(mockSchema))
  })

  test("renders CodeBlock when examples exist", async () => {
    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    await waitFor(() => {
      const codeBlockElement = getByTestId("code-block")
      expect(codeBlockElement).toBeInTheDocument()
      expect(codeBlockElement).toHaveAttribute("data-lang", "json")
      expect(codeBlockElement).toHaveTextContent('{"name": "test"}')
    })
  })

  test("does not render CodeBlock when examples are empty", () => {
    mockUseSchemaExample.mockReturnValue({
      examples: [],
    })
    const { queryByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    const codeBlockElement = queryByTestId("code-block")
    expect(codeBlockElement).not.toBeInTheDocument()
  })

  test("renders CodeBlock with formatted name as title", async () => {
    mockSingular.mockReturnValue("mockTagNam")
    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )
    await waitFor(() => {
      const codeBlockElement = getByTestId("code-block")
      expect(codeBlockElement).toHaveAttribute(
        "data-title",
        "The mockTagNam Object"
      )
    })
  })
})

describe("name formatting", () => {
  test("formats tag name using singular", () => {
    mockSingular.mockReturnValue("product")
    render(<TagSectionSchema schema={mockSchema} tagName="products" />)
    expect(mockSingular).toHaveBeenCalledWith("products")
  })

  test("removes spaces from formatted name", () => {
    mockSingular.mockReturnValue("test tag")
    const { container } = render(
      <TagSectionSchema schema={mockSchema} tagName="test tags" />
    )
    const heading = container.querySelector("h2")
    expect(heading).toHaveTextContent("testtag Object")
  })
})

describe("schema slug generation", () => {
  test("generates schema slug using getSectionId with tagName, formattedName, and 'schema'", () => {
    mockSingular.mockReturnValue("mockTagNam")
    render(<TagSectionSchema schema={mockSchema} tagName={mockTagName} />)
    expect(mockGetSectionId).toHaveBeenCalledWith([
      mockTagName,
      "mockTagNam",
      "schema",
    ])
  })
})

describe("useEffect scrolling behavior", () => {
  test("scrolls to element when hash matches schemaSlug and element is not in viewport", () => {
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    window.location.hash = `#${mockPath}`
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })
    mockCheckElementInViewport.mockReturnValue(false)

    // Create a mock element with the id
    const mockElement = document.createElement("div")
    mockElement.id = mockPath
    document.body.appendChild(mockElement)

    render(<TagSectionSchema schema={mockSchema} tagName={mockTagName} />)

    expect(mockScrollToElement).toHaveBeenCalledWith(mockElement)

    document.body.removeChild(mockElement)
  })

  test("does not scroll when element is already in viewport", () => {
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    window.location.hash = `#${mockPath}`
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })
    mockCheckElementInViewport.mockReturnValue(true)

    const mockElement = document.createElement("div")
    mockElement.id = mockPath
    document.body.appendChild(mockElement)

    render(<TagSectionSchema schema={mockSchema} tagName={mockTagName} />)

    expect(mockScrollToElement).not.toHaveBeenCalled()

    document.body.removeChild(mockElement)
  })

  test("does not scroll when hash does not match schemaSlug", () => {
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    window.location.hash = "#different-hash"
    mockUseSidebar.mockReturnValue({
      activePath: "different-hash",
      setActivePath: mockSetActivePath,
    })

    render(<TagSectionSchema schema={mockSchema} tagName={mockTagName} />)

    expect(mockScrollToElement).not.toHaveBeenCalled()
  })

  test("scrolls when activePath matches but hash does not", () => {
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    window.location.hash = "#different-hash"
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })
    mockCheckElementInViewport.mockReturnValue(false)

    // Create a mock element with the id
    const mockElement = document.createElement("div")
    mockElement.id = mockPath
    document.body.appendChild(mockElement)

    render(<TagSectionSchema schema={mockSchema} tagName={mockTagName} />)

    expect(mockScrollToElement).toHaveBeenCalledWith(mockElement)

    document.body.removeChild(mockElement)
  })

  test("does not scroll when not in browser", () => {
    mockUseIsBrowser.mockReturnValue({ isBrowser: false })
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    window.location.hash = `#${mockPath}`
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })

    render(<TagSectionSchema schema={mockSchema} tagName={mockTagName} />)

    expect(mockScrollToElement).not.toHaveBeenCalled()
  })
})

describe("handleViewChange behavior", () => {
  test("updates URL and active path when in view and activePath is different", () => {
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    mockUseSidebar.mockReturnValue({
      activePath: "different-path",
      setActivePath: mockSetActivePath,
    })
    mockCheckElementInViewport.mockReturnValue(true)

    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )

    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)

    expect(mockSetActivePath).toHaveBeenCalledWith(mockPath)
    expect(window.location.hash).toBe(`#${mockPath}`)
  })

  test("does not update when activePath already matches schemaSlug", () => {
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })
    mockCheckElementInViewport.mockReturnValue(true)

    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )

    const inViewToggleButton = getByTestId("in-view-toggle-button")
    mockSetActivePath.mockClear()
    fireEvent.click(inViewToggleButton)

    // Should not be called because activePath === schemaSlug, so the condition fails
    expect(mockSetActivePath).not.toHaveBeenCalled()
  })

  test("updates when element is in viewport even if not in view", () => {
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    mockUseSidebar.mockReturnValue({
      activePath: "different-path",
      setActivePath: mockSetActivePath,
    })
    mockCheckElementInViewport.mockReturnValue(true)

    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )

    const inViewToggleButton = getByTestId("in-view-toggle-button")
    // Click to set inView to false, but checkElementInViewport returns true
    fireEvent.click(inViewToggleButton)

    expect(mockSetActivePath).toHaveBeenCalledWith(mockPath)
  })

  test("does not update when not in browser", () => {
    mockUseIsBrowser.mockReturnValue({ isBrowser: false })
    const mockPath = "mock-schema-slug"
    mockGetSectionId.mockReturnValue(mockPath)
    mockUseSidebar.mockReturnValue({
      activePath: "different-path",
      setActivePath: mockSetActivePath,
    })

    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )

    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)

    expect(mockSetActivePath).not.toHaveBeenCalled()
  })
})

describe("browser environment", () => {
  test("handles non-browser environment", () => {
    mockUseIsBrowser.mockReturnValue({ isBrowser: false })

    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )

    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).not.toHaveAttribute("data-root")
  })

  test("uses document.body as root when scrollableElement is window", () => {
    mockIsElmWindow.mockReturnValue(true)
    mockUseScrollController.mockReturnValue({
      scrollableElement: window as unknown as HTMLElement,
      scrollToElement: mockScrollToElement,
    })
    mockUseIsBrowser.mockReturnValue({ isBrowser: true })

    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )

    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).toHaveAttribute("data-root", "BODY")
  })

  test("uses scrollableElement as root when it is not window", () => {
    const mockScrollableElement = document.createElement("div")
    mockIsElmWindow.mockReturnValue(false)
    mockUseIsBrowser.mockReturnValue({ isBrowser: true })
    mockUseScrollController.mockReturnValue({
      scrollableElement: mockScrollableElement,
      scrollToElement: mockScrollToElement,
    })

    const { getByTestId } = render(
      <TagSectionSchema schema={mockSchema} tagName={mockTagName} />
    )

    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).toHaveAttribute("data-root", "DIV")
  })
})