import React, { useState } from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor, act, fireEvent } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockOperation: OpenAPI.Operation = {
  operationId: "mockOperation",
  summary: "Mock Operation",
  description: "Mock Operation",
  "x-authenticated": false,
  "x-codeSamples": [
    {
      label: "Request Sample 1",
      lang: "javascript",
      source: "console.log('Request Sample 1')",
    }
  ],
  requestBody: {
    content: {},
  },
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
}

const mockTag: OpenAPI.OpenAPIV3.TagObject = {
  name: "mock-tag",
  description: "Mock Tag",
}
const mockEndpointPath = "/mock-endpoint-path"

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
const mockRemoveLoading = vi.fn()
const mockUseLoading = vi.fn(() => ({
  loading: false,
  removeLoading: mockRemoveLoading,
}))
const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockUseRouter = vi.fn(() => ({
  push: mockPush,
  replace: mockReplace,
}))
const mockGetSectionId = vi.fn((options: unknown) => "mock-section-id")
const mockCheckElementInViewport = vi.fn(() => true)


// mock components
vi.mock("react-intersection-observer", () => ({
  InView: ({ children, onChange, root }: { children: React.ReactNode, onChange: (inView: boolean) => void, root: HTMLElement | null }) => {
    const [inView, setInView] = useState(false)
    return (
      <div data-testid="in-view" data-root={root?.tagName}>
        {children}
        <button type="button" data-testid="in-view-toggle-button" onClick={(e) => {
          setInView(!inView)
          onChange(!inView)
        }}>
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
}))
vi.mock("@/components/Tags/Operation/CodeSection", () => ({
  default: ({ operation, method }: { operation: OpenAPI.Operation, method?: string }) => (
    <div data-testid="code-section" data-method={method}>{JSON.stringify(operation)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/DescriptionSection", () => ({
  default: ({ operation}: { operation: OpenAPI.Operation }) => (
    <div data-testid="description-section">{JSON.stringify(operation)}</div>
  ),
}))
vi.mock("@/layouts/Divided", () => ({
  default: ({ mainContent, codeContent }: { mainContent: React.ReactNode, codeContent: React.ReactNode }) => (
    <div data-testid="divided">
      <div data-testid="divided-main-content">{mainContent}</div>
      <div data-testid="divided-code-content">{codeContent}</div>
    </div>
  ),
}))
vi.mock("@/providers/loading", () => ({
  useLoading: () => mockUseLoading(),
}))
vi.mock("@/utils/check-element-in-viewport", () => ({
  default: () => mockCheckElementInViewport(),
}))
vi.mock("@/components/DividedLoading", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="divided-loading">{children}</div>
  ),
}))
vi.mock("@/components/Section/Container", () => ({
  default: React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
    ({ children, className }, ref) => (
      <div data-testid="section-container" className={className} ref={ref}>
        {children}
      </div>
    )
  ),
}))
vi.mock("docs-utils", () => ({
  getSectionId: (options: unknown) => mockGetSectionId(options),
}))
vi.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
}))

import TagOperation from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
  // Reset location hash
  window.location.hash = ""
})

describe("rendering", () => {
  test("renders InView wrapper with correct props", () => {
    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )
    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
  })

  test("renders SectionContainer", () => {
    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )
    const sectionContainerElement = getByTestId("section-container")
    expect(sectionContainerElement).toBeInTheDocument()
  })

  test("renders with className", () => {
    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
        className="test-class"
      />
    )
    const sectionContainerElement = getByTestId("section-container")
    expect(sectionContainerElement).toHaveClass("test-class")
  })

  test("renders loading component when show is false", () => {
    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )
    const loadingElement = getByTestId("divided-loading")
    expect(loadingElement).toBeInTheDocument()
  })

  test("renders loading component initially", () => {
    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )
    const loadingElement = getByTestId("divided-loading")
    expect(loadingElement).toBeInTheDocument()
  })
})

describe("path generation", () => {
  test("generates path using getSectionId with tags and operationId", () => {
    const operationWithTags: OpenAPI.Operation = {
      ...mockOperation,
      tags: ["tag1", "tag2"],
      operationId: "test-operation",
    }
    render(
      <TagOperation
        operation={operationWithTags}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )
    expect(mockGetSectionId).toHaveBeenCalledWith(["tag1", "tag2", "test-operation"])
  })

  test("generates path using getSectionId with empty tags array when tags are not provided", () => {
    const operationWithoutTags: OpenAPI.Operation = {
      ...mockOperation,
      tags: undefined,
      operationId: "test-operation",
    }
    render(
      <TagOperation
        operation={operationWithoutTags}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )
    expect(mockGetSectionId).toHaveBeenCalledWith(["test-operation"])
  })
})

describe("hash matching and scrolling", () => {
  test("removes loading when nodeRef is set", async () => {
    render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    expect(mockRemoveLoading).toHaveBeenCalled()
  })

  test("scrolls into view when hash matches path", async () => {
    const mockPath = "mock-section-id"
    mockGetSectionId.mockReturnValue(mockPath)
    window.location.hash = `#${mockPath}`
    
    const { container } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    expect(mockRemoveLoading).toHaveBeenCalled()

    await waitFor(() => {
      const operationContainer = container.querySelector("[data-testid='operation-container']")
      expect(operationContainer).toBeInTheDocument()
    })
  })

  test("sets show to true when hash prefix matches path prefix", async () => {
    const mockPath = "mock-section-id_subsection"
    mockGetSectionId.mockReturnValue(mockPath)
    window.location.hash = "#mock-section-id"

    const { container } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    expect(mockRemoveLoading).toHaveBeenCalled()

    await waitFor(() => {
      const operationContainer = container.querySelector("[data-testid='operation-container']")
      expect(operationContainer).toBeInTheDocument()
    })
  })
})

describe("InView behavior", () => {
  test("sets active path when in view and activePath is different", () => {
    const mockPath = "mock-section-id"
    window.location.hash = "#different-hash"
    mockGetSectionId.mockReturnValue(mockPath)
    mockUseSidebar.mockReturnValue({
      activePath: "different-hash",
      setActivePath: mockSetActivePath,
    })

    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    expect(mockSetActivePath).toHaveBeenCalledWith(mockPath)
  })

  test("updates router hash when in view and hash is different", () => {
    const mockPath = "mock-section-id"
    mockGetSectionId.mockReturnValue(mockPath)
    window.location.hash = "#different-hash"

    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    expect(getByTestId("in-view")).toBeInTheDocument()
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    expect(mockPush).toHaveBeenCalledWith(`#${mockPath}`, { scroll: false })
  })

  test("removes loading when in view and loading is true", () => {
    mockUseLoading.mockReturnValue({
      loading: true,
      removeLoading: mockRemoveLoading,
    })

    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    expect(getByTestId("in-view")).toBeInTheDocument()
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    expect(mockRemoveLoading).toHaveBeenCalled()
  })

  test("sets show to false when out of view and element is not in viewport", () => {
    mockCheckElementInViewport.mockReturnValue(false)

    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    expect(getByTestId("in-view")).toBeInTheDocument()
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    // toggle it to true
    fireEvent.click(inViewToggleButton)
    // toggle it to false
    fireEvent.click(inViewToggleButton)
    // should show the divided loading now
    expect(getByTestId("divided-loading")).toBeInTheDocument()
  })
})

describe("browser environment", () => {
  test("handles non-browser environment", () => {
    mockUseIsBrowser.mockReturnValue({ isBrowser: false })

    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).not.toHaveAttribute("data-root")
  })

  test("uses document.body as root when scrollableElement is window and isBrowser is true", () => {
    mockIsElmWindow.mockReturnValue(true)
    mockUseScrollController.mockReturnValue({
      scrollableElement: window as unknown as HTMLElement,
      scrollToTop: mockScrollToTop,
    })
    mockUseIsBrowser.mockReturnValue({ isBrowser: true })

    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).toHaveAttribute("data-root", "BODY")
  })

  test("uses scrollableElement as root when it is not window and isBrowser is true", () => {
    const mockScrollableElement = document.createElement("div")
    mockIsElmWindow.mockReturnValue(false)
    mockUseIsBrowser.mockReturnValue({ isBrowser: true })
    mockUseScrollController.mockReturnValue({
      scrollableElement: mockScrollableElement,
      scrollToTop: mockScrollToTop,
    })

    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )

    const inViewElement = getByTestId("in-view")
    expect(inViewElement).toBeInTheDocument()
    expect(inViewElement).toHaveAttribute("data-root", "DIV")
  })
})

describe("method prop", () => {
  test("renders component with method prop", async () => {
    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
        method="POST"
      />
    )
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    // set show to true
    fireEvent.click(inViewToggleButton)
    await waitFor(() => {
      const codeSectionElement = getByTestId("code-section")
      expect(codeSectionElement).toBeInTheDocument()
      expect(codeSectionElement).toHaveAttribute("data-method", "POST")
    })
  })

  test("renders component without method prop", async () => {
    const { getByTestId } = render(
      <TagOperation
        operation={mockOperation}
        tag={mockTag}
        endpointPath={mockEndpointPath}
      />
    )
    
    const inViewToggleButton = getByTestId("in-view-toggle-button")
    fireEvent.click(inViewToggleButton)
    await waitFor(() => {
      const codeSectionElement = getByTestId("code-section")
      expect(codeSectionElement).toBeInTheDocument()
      expect(codeSectionElement).toHaveAttribute("data-method", "")
    })
  })
})

