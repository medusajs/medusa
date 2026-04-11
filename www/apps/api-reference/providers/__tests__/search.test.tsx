import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import SearchProvider from "../search"

// Mock functions
const mockIsLoading = vi.fn(() => false)
const mockUsePageLoading = vi.fn(() => ({
  isLoading: mockIsLoading(),
}))
const mockBasePathUrl = vi.fn((url: string) => url)

vi.mock("docs-ui", () => ({
  usePageLoading: () => mockUsePageLoading(),
  SearchProvider: ({
    children,
    algolia,
    indices,
    defaultIndex,
    searchProps,
  }: {
    children: React.ReactNode
    algolia: unknown
    indices: unknown[]
    defaultIndex: string
    searchProps: unknown
  }) => (
    <div
      data-testid="ui-search-provider"
      data-algolia={JSON.stringify(algolia)}
      data-indices={JSON.stringify(indices)}
      data-default-index={defaultIndex}
      data-search-props={JSON.stringify(searchProps)}
    >
      {children}
    </div>
  ),
}))

vi.mock("@/config", () => ({
  config: {
    baseUrl: "https://test.com",
  },
}))

vi.mock("@/utils/base-path-url", () => ({
  default: (url: string) => mockBasePathUrl(url),
}))

describe("SearchProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    // Set environment variables
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app-id"
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY = "test-api-key"
    process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME = "test-api-index"
    process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME = "test-docs-index"
    mockIsLoading.mockReturnValue(false)
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { getByText } = render(
        <SearchProvider>
          <div>Test Content</div>
        </SearchProvider>
      )
      expect(getByText("Test Content")).toBeInTheDocument()
    })

    test("renders UiSearchProvider with correct props", () => {
      const { getByTestId } = render(
        <SearchProvider>
          <div>Test</div>
        </SearchProvider>
      )
      const uiProvider = getByTestId("ui-search-provider")
      expect(uiProvider).toBeInTheDocument()

      const algolia = JSON.parse(uiProvider.getAttribute("data-algolia") || "{}")
      expect(algolia).toEqual({
        appId: "test-app-id",
        apiKey: "test-api-key",
        mainIndexName: "test-api-index",
      })

      const indices = JSON.parse(uiProvider.getAttribute("data-indices") || "[]")
      expect(indices).toEqual([
        {
          value: "test-docs-index",
          title: "Docs",
        },
        {
          value: "test-api-index",
          title: "Store & Admin API",
        },
      ])

      expect(uiProvider.getAttribute("data-default-index")).toBe("test-api-index")
    })
  })

  describe("environment variables", () => {
    test("uses default values when env vars are not set", () => {
      delete process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
      delete process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
      delete process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME
      delete process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME

      const { getByTestId } = render(
        <SearchProvider>
          <div>Test</div>
        </SearchProvider>
      )
      const uiProvider = getByTestId("ui-search-provider")
      const algolia = JSON.parse(uiProvider.getAttribute("data-algolia") || "{}")
      expect(algolia.appId).toBe("temp")
      expect(algolia.apiKey).toBe("temp")
      expect(algolia.mainIndexName).toBe("temp")
    })
  })

  describe("searchProps", () => {
    test("passes isLoading from usePageLoading", () => {
      mockIsLoading.mockReturnValue(true)
      const { getByTestId } = render(
        <SearchProvider>
          <div>Test</div>
        </SearchProvider>
      )
      const uiProvider = getByTestId("ui-search-provider")
      const searchProps = JSON.parse(uiProvider.getAttribute("data-search-props") || "{}")
      expect(searchProps.isLoading).toBe(true)
    })

    test("includes suggestions", () => {
      const { getByTestId } = render(
        <SearchProvider>
          <div>Test</div>
        </SearchProvider>
      )
      const uiProvider = getByTestId("ui-search-provider")
      const searchProps = JSON.parse(uiProvider.getAttribute("data-search-props") || "{}")
      expect(searchProps.suggestions).toBeDefined()
      expect(Array.isArray(searchProps.suggestions)).toBe(true)
      expect(searchProps.suggestions.length).toBeGreaterThan(0)
    })

    test("includes checkInternalPattern regex", () => {
      const { getByTestId } = render(
        <SearchProvider>
          <div>Test</div>
        </SearchProvider>
      )
      const uiProvider = getByTestId("ui-search-provider")
      const searchProps = JSON.parse(uiProvider.getAttribute("data-search-props") || "{}")
      expect(searchProps.checkInternalPattern).toBeDefined()
    })
  })
})

