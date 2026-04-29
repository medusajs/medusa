import React, { useState } from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor, fireEvent } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockTag: OpenAPI.TagObject = {
  name: "mockTag",
  description: "Mock Tag Description",
}

const mockTagWithExternalDocs: OpenAPI.TagObject = {
  name: "mockTag",
  description: "Mock Tag Description",
  externalDocs: {
    url: "https://example.com/guide",
    description: "Read the guide",
  },
}

const mockTagWithSchema: OpenAPI.TagObject = {
  name: "mockTag",
  description: "Mock Tag Description",
  "x-associatedSchema": {
    $ref: "#/components/schemas/MockSchema",
  },
}

const mockSchemaData = {
  schema: {
    type: "object",
    properties: {
      name: { type: "string", properties: {} },
    },
  } as OpenAPI.SchemaObject,
}

const mockPathsData = {
  paths: {
    "/mock-path": {
      get: {
        operationId: "mockOperation",
        summary: "Mock Operation",
        description: "Mock Operation",
        "x-authenticated": false,
        "x-codeSamples": [],
        requestBody: { content: {} },
        parameters: [],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", properties: {} },
                  },
                },
              },
            },
          },
        },
      },
    },
  } as OpenAPI.PathsObject,
}

// mock functions
const mockIsElmWindow = vi.fn(() => false)
const mockUseIsBrowser = vi.fn(() => ({
  isBrowser: true,
}))
const mockScrollToTop = vi.fn()
const mockUseScrollController = vi.fn(() => ({
  scrollableElement: null as HTMLElement | null,
  scrollToTop: mockScrollToTop,
}))
const mockSetActivePath = vi.fn()
const mockUseSidebar = vi.fn(() => ({
  activePath: null as string | null,
  setActivePath: mockSetActivePath,
}))
const mockUseArea = vi.fn(() => ({
  area: "store",
}))
const mockGetSectionId = vi.fn((options: unknown) => "mock-slug-tag-name")
const mockCheckElementInViewport = vi.fn(
  (_element: HTMLElement, _threshold: number) => true
)
const mockBasePathUrl = vi.fn((url: string) => url)
const mockSwrFetcher = vi.fn()
const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockUseRouter = vi.fn(() => ({
  push: mockPush,
  replace: mockReplace,
}))
const mockUseSWR = vi.fn((key: string | null, fetcher: unknown, options: unknown) => ({
  data: undefined as {paths: OpenAPI.PathsObject} | {schema: OpenAPI.SchemaObject} | undefined,
  error: undefined,
  isLoading: false,
}))

// mock components
vi.mock("react-intersection-observer", () => ({
  InView: ({
    children,
    onChange,
    root,
    id,
    className,
  }: {
    children: React.ReactNode
    onChange: (inView: boolean) => void
    root?: HTMLElement | null
    id?: string
    className?: string
  }) => {
    const [inView, setInView] = useState(false)

    return (
      <div
        data-testid="in-view"
        data-root={root?.tagName}
        id={id}
        className={className}
      >
        {children}
        <button
          type="button"
          data-testid="in-view-toggle-button"
          onClick={() => {
            const newInView = !inView
            setInView(newInView)
            onChange(newInView)
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
  H2: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="h2">{children}</h2>
  ),
  Link: ({
    href,
    children,
    target,
    variant,
  }: {
    href: string
    children: React.ReactNode
    target?: string
    variant?: string
  }) => (
    <a data-testid="link" href={href} target={target} data-variant={variant}>
      {children}
    </a>
  ),
  Loading: () => <div data-testid="loading">Loading...</div>,
  swrFetcher: () => mockSwrFetcher(),
}))
vi.mock("@/providers/area", () => ({
  useArea: () => mockUseArea(),
}))
vi.mock("@/components/Section/Container", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-container">{children}</div>
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
vi.mock("@/components/Tags/Section/Schema", () => ({
  default: ({
    schema,
    tagName,
  }: {
    schema: OpenAPI.SchemaObject
    tagName: string
  }) => (
    <div data-testid="tag-section-schema" data-tag-name={tagName}>
      {JSON.stringify(schema)}
    </div>
  ),
}))
vi.mock("@/components/Tags/Paths", () => ({
  default: ({
    tag,
    paths,
  }: {
    tag: OpenAPI.TagObject
    paths: OpenAPI.PathsObject
  }) => (
    <div data-testid="tag-paths" data-tag-name={tag.name}>
      {JSON.stringify(paths)}
    </div>
  ),
}))
vi.mock("@/components/Tags/Section/RoutesSummary", () => ({
  RoutesSummary: ({
    tagName,
    paths,
  }: {
    tagName: string
    paths: OpenAPI.PathsObject
  }) => (
    <div data-testid="routes-summary" data-tag-name={tagName}>
      {JSON.stringify(paths)}
    </div>
  ),
}))
vi.mock("@/components/Section/Divider", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="section-divider" className={className} />
  ),
}))
vi.mock("@/components/Feedback", () => ({
  Feedback: ({
    question,
    extraData,
  }: {
    question: string
    extraData: { section: string }
  }) => (
    <div data-testid="feedback" data-section={extraData.section}>
      {question}
    </div>
  ),
}))
vi.mock("@/providers/loading", () => ({
  default: ({
    children,
    initialLoading,
  }: {
    children: React.ReactNode
    initialLoading?: boolean
  }) => (
    <div data-testid="loading-provider" data-initial-loading={initialLoading?.toString()}>
      {children}
    </div>
  ),
}))
vi.mock("@/components/MDXContent/Client", () => ({
  default: ({
    content,
    scope,
  }: {
    content: string
    scope: { addToSidebar: boolean }
  }) => (
    <div data-testid="mdx-content-client" data-add-to-sidebar={scope.addToSidebar.toString()}>
      {content}
    </div>
  ),
}))
vi.mock("@/components/Section/Divider", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="section-divider" className={className} />
  ),
}))
vi.mock("@/components/Section", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section">{children}</div>
  ),
}))
vi.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
}))
vi.mock("docs-utils", () => ({
  getSectionId: (options: unknown) => mockGetSectionId(options),
}))
vi.mock("@/utils/check-element-in-viewport", () => ({
  default: (element: HTMLElement, threshold: number) =>
    mockCheckElementInViewport(element, threshold),
}))
vi.mock("@/utils/base-path-url", () => ({
  default: (url: string) => mockBasePathUrl(url),
}))
vi.mock("swr", () => ({
  default: (key: string | null, fetcher: unknown, options: unknown) =>
    mockUseSWR(key, fetcher, options),
}))

import TagSectionComponent from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
  window.location.hash = ""
  // Reset mocks to default values
  mockIsElmWindow.mockReturnValue(false)
  mockUseIsBrowser.mockReturnValue({ isBrowser: true })
  mockUseScrollController.mockReturnValue({
    scrollableElement: null,
    scrollToTop: mockScrollToTop,
  })
  mockUseSidebar.mockReturnValue({
    activePath: null,
    setActivePath: mockSetActivePath,
  })
  mockUseArea.mockReturnValue({
    area: "store",
  })
  mockGetSectionId.mockReturnValue("mock-slug-tag-name")
  mockCheckElementInViewport.mockReturnValue(true)
  mockBasePathUrl.mockImplementation((url: string) => url)
  mockUseSWR.mockReturnValue({
    data: undefined,
    error: undefined,
    isLoading: false,
  })
})

describe("rendering", () => {
  test("renders InView wrapper with correct props", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).toHaveAttribute("id", "mock-slug-tag-name")
    expect(inViewElement).toHaveClass("min-h-screen", "relative")
  })

  test("renders SectionContainer", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const sectionContainerElement = getByTestId("section-container")
    expect(sectionContainerElement).toBeInTheDocument()
  })

  test("renders DividedLayout with mainContent and codeContent", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const dividedElement = getByTestId("divided")
    expect(dividedElement).toBeInTheDocument()
    expect(getByTestId("divided-main-content")).toBeInTheDocument()
    expect(getByTestId("divided-code-content")).toBeInTheDocument()
  })

  test("renders H2 with tag name", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const h2Element = getByTestId("h2")
    expect(h2Element).toBeInTheDocument()
    expect(h2Element).toHaveTextContent(mockTag.name)
  })

  test("renders MDXContentClient when tag has description", async () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    await waitFor(() => {
      const mdxContentElement = getByTestId("mdx-content-client")
      expect(mdxContentElement).toBeInTheDocument()
      expect(mdxContentElement).toHaveTextContent(mockTag.description!)
      expect(mdxContentElement).toHaveAttribute("data-add-to-sidebar", "false")
    })
  })

  test("does not render MDXContentClient when tag has no description", () => {
    const tagWithoutDescription: OpenAPI.TagObject = {
      name: "mockTag",
    }
    const { queryByTestId } = render(
      <TagSectionComponent tag={tagWithoutDescription} />
    )
    const mdxContentElement = queryByTestId("mdx-content-client")
    expect(mdxContentElement).not.toBeInTheDocument()
  })

  test("renders external docs link when tag has externalDocs", () => {
    const { getByTestId } = render(
      <TagSectionComponent tag={mockTagWithExternalDocs} />
    )
    const linkElement = getByTestId("link")
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute(
      "href",
      mockTagWithExternalDocs.externalDocs!.url
    )
    expect(linkElement).toHaveAttribute("target", "_blank")
    expect(linkElement).toHaveTextContent(
      mockTagWithExternalDocs.externalDocs!.description!
    )
  })

  test("renders 'Read More' when externalDocs has no description", () => {
    const tagWithExternalDocsNoDescription: OpenAPI.TagObject = {
      name: "mockTag",
      externalDocs: {
        url: "https://example.com/guide",
      },
    }
    const { getByTestId } = render(
      <TagSectionComponent tag={tagWithExternalDocsNoDescription} />
    )
    const linkElement = getByTestId("link")
    expect(linkElement).toHaveTextContent("Read More")
  })

  test("does not render external docs link when tag has no externalDocs", () => {
    const { queryByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const linkElement = queryByTestId("link")
    expect(linkElement).not.toBeInTheDocument()
  })

  test("renders Feedback component", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const feedbackElement = getByTestId("feedback")
    expect(feedbackElement).toBeInTheDocument()
    expect(feedbackElement).toHaveAttribute("data-section", mockTag.name)
    expect(feedbackElement).toHaveTextContent("Was this section helpful?")
  })

  test("renders RoutesSummary with empty paths initially", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const routesSummaryElement = getByTestId("routes-summary")
    expect(routesSummaryElement).toBeInTheDocument()
    expect(routesSummaryElement).toHaveAttribute("data-tag-name", mockTag.name)
    expect(routesSummaryElement).toHaveTextContent("{}")
  })

  test("renders SectionDivider when loadData is false", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const dividerElement = getByTestId("section-divider")
    expect(dividerElement).toBeInTheDocument()
    expect(dividerElement).toHaveClass("lg:!-left-1")
  })

  test("does not render SectionDivider when loadData is true", () => {
    mockUseSWR.mockReturnValue({
      data: { paths: mockPathsData },
      error: undefined,
      isLoading: false,
    })
    const { getByTestId, queryByTestId } = render(
      <TagSectionComponent tag={mockTag} />
    )
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    waitFor(() => {
      const dividerElement = queryByTestId("section-divider")
      expect(dividerElement).not.toBeInTheDocument()
    })
  })
})

describe("slug generation", () => {
  test("generates slug using getSectionId with tag name", () => {
    render(<TagSectionComponent tag={mockTag} />)
    expect(mockGetSectionId).toHaveBeenCalledWith([mockTag.name])
  })
})

describe("useSWR hooks", () => {
  test("does not fetch schema data when loadData is false", () => {
    render(<TagSectionComponent tag={mockTagWithSchema} />)
    expect(mockUseSWR).not.toHaveBeenCalledWith(
      `/schema?name=${mockTagWithSchema["x-associatedSchema"]!.$ref}&area=store`,
    )
  })

  test("fetches schema data when loadData is true and tag has x-associatedSchema", () => {
    mockUseSWR.mockReturnValue({
      data: mockSchemaData,
      error: undefined,
      isLoading: false,
    })
    const { getByTestId } = render(
      <TagSectionComponent tag={mockTagWithSchema} />
    )
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    expect(mockBasePathUrl).toHaveBeenCalledWith(
      `/schema?name=${mockTagWithSchema["x-associatedSchema"]!.$ref}&area=store`
    )
  })

  test("does not fetch paths data when loadData is false", () => {
    render(<TagSectionComponent tag={mockTag} />)
    expect(mockUseSWR).not.toHaveBeenCalledWith(`/tag?tagName=mock-slug-tag-name&area=store`)
  })

  test("fetches paths data when loadData is true", () => {
    mockUseSWR.mockReturnValue({
      data: mockPathsData,
      error: undefined,
      isLoading: false,
    })
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    expect(mockBasePathUrl).toHaveBeenCalledWith(
      `/tag?tagName=mock-slug-tag-name&area=store`
    )
  })
})

describe("conditional rendering", () => {
  test("renders TagSectionSchema when schemaData exists", async () => {
    mockUseSWR.mockImplementation((key: string | null) => {
      if (key?.includes("schema")) {
        return {
          data: mockSchemaData,
          error: undefined,
          isLoading: false,
        }
      }
      return {
        data: undefined,
        error: undefined,
        isLoading: false,
      }
    })
    const { getByTestId } = render(
      <TagSectionComponent tag={mockTagWithSchema} />
    )
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    await waitFor(() => {
      const schemaElement = getByTestId("tag-section-schema")
      expect(schemaElement).toBeInTheDocument()
      expect(schemaElement).toHaveAttribute("data-tag-name", mockTagWithSchema.name)
    })
  })

  test("does not render TagSectionSchema when schemaData does not exist", () => {
    const { queryByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const schemaElement = queryByTestId("tag-section-schema")
    expect(schemaElement).not.toBeInTheDocument()
  })

  test("renders TagPaths when loadData is true and pathsData exists", async () => {
    mockUseSWR.mockReturnValue({
      data: mockPathsData,
      error: undefined,
      isLoading: false,
    })
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    await waitFor(() => {
      const tagPathsElement = getByTestId("tag-paths")
      expect(tagPathsElement).toBeInTheDocument()
      expect(tagPathsElement).toHaveAttribute("data-tag-name", mockTag.name)
    })
  })

  test("does not render TagPaths when loadData is false", () => {
    const { queryByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const tagPathsElement = queryByTestId("tag-paths")
    expect(tagPathsElement).not.toBeInTheDocument()
  })

  test("renders LoadingProvider with initialLoading when TagPaths is rendered", async () => {
    mockUseSWR.mockReturnValue({
      data: mockPathsData,
      error: undefined,
      isLoading: false,
    })
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    await waitFor(() => {
      const loadingProviderElement = getByTestId("loading-provider")
      expect(loadingProviderElement).toBeInTheDocument()
      expect(loadingProviderElement).toHaveAttribute(
        "data-initial-loading",
        "true"
      )
    })
  })
})

describe("useEffect scrolling behavior", () => {
  test("scrolls to element when activePath matches slugTagName and element is not in viewport", () => {
    const mockPath = "mock-slug-tag-name"
    mockGetSectionId.mockReturnValue(mockPath)
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })
    mockCheckElementInViewport.mockReturnValue(false)

    const mockElement = document.createElement("div")
    mockElement.id = mockPath
    Object.defineProperty(mockElement, "offsetTop", { value: 100 })
    Object.defineProperty(mockElement, "offsetParent", { value: { offsetTop: 50 } as HTMLElement })
    document.body.appendChild(mockElement)

    render(<TagSectionComponent tag={mockTag} />)

    expect(mockScrollToTop).toHaveBeenCalledWith(150, 0)

    document.body.removeChild(mockElement)
  })

  test("does not scroll when element is already in viewport", () => {
    const mockPath = "mock-slug-tag-name"
    mockGetSectionId.mockReturnValue(mockPath)
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })
    mockCheckElementInViewport.mockReturnValue(true)

    const mockElement = document.createElement("div")
    mockElement.id = mockPath
    document.body.appendChild(mockElement)

    render(<TagSectionComponent tag={mockTag} />)

    expect(mockScrollToTop).not.toHaveBeenCalled()

    document.body.removeChild(mockElement)
  })

  test("sets loadData to true when activePath has multiple parts", () => {
    const mockPath = "mock-slug-tag-name_operation"
    mockGetSectionId.mockReturnValue("mock-slug-tag-name")
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })

    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    // After useEffect runs, loadData should be true, so divider should not be visible
    waitFor(() => {
      const dividerElement = getByTestId("section-divider")
      expect(dividerElement).not.toBeInTheDocument()
    })
  })

  test("does not scroll when activePath does not include slugTagName", () => {
    mockUseSidebar.mockReturnValue({
      activePath: "different-path",
      setActivePath: mockSetActivePath,
    })

    render(<TagSectionComponent tag={mockTag} />)

    expect(mockScrollToTop).not.toHaveBeenCalled()
  })

  test("does not scroll when activePath is null", () => {
    mockUseSidebar.mockReturnValue({
      activePath: null,
      setActivePath: mockSetActivePath,
    })

    render(<TagSectionComponent tag={mockTag} />)

    expect(mockScrollToTop).not.toHaveBeenCalled()
  })

  test("does not scroll when not in browser", () => {
    mockUseIsBrowser.mockReturnValue({ isBrowser: false })
    const mockPath = "mock-slug-tag-name"
    mockGetSectionId.mockReturnValue(mockPath)
    mockUseSidebar.mockReturnValue({
      activePath: mockPath,
      setActivePath: mockSetActivePath,
    })

    render(<TagSectionComponent tag={mockTag} />)

    expect(mockScrollToTop).not.toHaveBeenCalled()
  })
})

describe("InView onChange behavior", () => {
  test("sets loadData to true when in view", () => {
    const { getByTestId, queryByTestId } = render(
      <TagSectionComponent tag={mockTag} />
    )
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    // After loadData is set, divider should disappear
    waitFor(() => {
      const dividerElement = queryByTestId("section-divider")
      expect(dividerElement).not.toBeInTheDocument()
    })
  })

  test("updates router hash when in view and hash does not match", () => {
    window.location.hash = "#different-hash"
    mockUseSidebar.mockReturnValue({
      activePath: "different-path",
      setActivePath: mockSetActivePath,
    })
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)

    expect(mockPush).toHaveBeenCalledWith("#mock-slug-tag-name", {
      scroll: false,
    })
  })

  test("sets active path when in view and activePath is different", () => {
    mockUseSidebar.mockReturnValue({
      activePath: "different-path",
      setActivePath: mockSetActivePath,
    })
    window.location.hash = "#mock-slug-tag-name"

    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)

    expect(mockSetActivePath).toHaveBeenCalledWith("mock-slug-tag-name")
  })

  test("does not update hash when current hash links to inner path", () => {
    window.location.hash = "#mock-slug-tag-name_operation"
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    mockSetActivePath.mockClear()
    fireEvent.click(inViewToggleButton)

    // Should not update because hash links to inner path
    expect(mockSetActivePath).not.toHaveBeenCalledWith("mock-slug-tag-name")
  })

  test("does not update when hash already matches slugTagName", () => {
    window.location.hash = "#mock-slug-tag-name"
    mockUseSidebar.mockReturnValue({
      activePath: "mock-slug-tag-name",
      setActivePath: mockSetActivePath,
    })

    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    mockSetActivePath.mockClear()
    fireEvent.click(inViewToggleButton)

    // Should not update because already matches
    expect(mockSetActivePath).not.toHaveBeenCalled()
  })

  test("does not update when not in view", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    // Click once to set inView to true, then click again to set to false
    fireEvent.click(inViewToggleButton)
    mockSetActivePath.mockClear()
    fireEvent.click(inViewToggleButton)

    // Should not update when not in view
    expect(mockSetActivePath).not.toHaveBeenCalled()
  })
})

describe("className behavior", () => {
  test("applies 'relative' class when loadData is false", () => {
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toHaveClass("relative")
  })

  test("does not apply 'relative' class when loadData is true", async () => {
    mockUseSWR.mockReturnValue({
      data: mockPathsData,
      error: undefined,
      isLoading: false,
    })
    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    await waitFor(() => {
      const inViewElement = getByTestId("in-view")
      expect(inViewElement).not.toHaveClass("relative")
    })
  })
})

describe("browser environment", () => {
  test("handles non-browser environment", () => {
    mockUseIsBrowser.mockReturnValue({ isBrowser: false })

    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).not.toHaveAttribute("data-root")
  })

  test("uses document.body as root when scrollableElement is window", () => {
    mockIsElmWindow.mockReturnValue(true)
    mockUseScrollController.mockReturnValue({
      scrollableElement: window as unknown as HTMLElement,
      scrollToTop: mockScrollToTop,
    })
    mockUseIsBrowser.mockReturnValue({ isBrowser: true })

    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
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
      scrollToTop: mockScrollToTop,
    })

    const { getByTestId } = render(<TagSectionComponent tag={mockTag} />)
    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).toHaveAttribute("data-root", "DIV")
  })
})

