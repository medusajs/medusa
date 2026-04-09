import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI, Sidebar } from "types"

// mock data
const mockShownSidebar: Sidebar.Sidebar = {
  sidebar_id: "test-sidebar",
  title: "Test Sidebar",
  items: [],
}

const mockBaseSpecs: OpenAPI.ExpandedDocument = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  tags: [
    {
      name: "TestTag",
    },
  ],
  expandedTags: {
    "testtag": {
      "get": {
        summary: "Test Operation",
        description: "Test Operation Description",
        parameters: [],
      },
    },
  },
  paths: {
    "/test-path": {
      get: {
        operationId: "test-operation",
        summary: "Test Operation",
        description: "Test Operation Description",
        "x-authenticated": false,
        "x-codeSamples": [],
        parameters: [],
        responses: {
          "200": {
            description: "OK",
            content: {}
          }
        },
        requestBody: {
          content: {}
        }
      },
    },
  },
  components: {
    securitySchemes: {
      "test-security": {
        type: "http",
        scheme: "bearer",
      },
    },
  },
}

// Mock functions
const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockUseRouter = vi.fn(() => ({
  push: mockPush,
  replace: mockReplace,
}))
const mockSetActivePath = vi.fn()
const mockResetItems = vi.fn()
const mockUpdateItems = vi.fn()
const mockUseSidebar = vi.fn(() => ({
  activePath: "testtag",
  setActivePath: mockSetActivePath,
  resetItems: mockResetItems,
  updateItems: mockUpdateItems,
  shownSidebar: mockShownSidebar as Sidebar.Sidebar | Sidebar.SidebarItemSidebar | undefined,
}))
const mockGetSectionId = vi.fn((parts: string[]) => parts.join("-").toLowerCase())
const mockGetTagChildSidebarItems = vi.fn(() => [] as Sidebar.SidebarItem[])

vi.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
}))

vi.mock("docs-ui", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("docs-utils", () => ({
  getSectionId: (parts: string[]) => mockGetSectionId(parts),
}))

vi.mock("@/utils/get-tag-child-sidebar-items", () => ({
  default: () => mockGetTagChildSidebarItems(),
}))

import BaseSpecsProvider, { useBaseSpecs } from "../base-specs"

// Test component that uses the hook
const TestComponent = () => {
  const { baseSpecs, getSecuritySchema } = useBaseSpecs()
  return (
    <div>
      <div data-testid="base-specs">{baseSpecs ? "present" : "null"}</div>
      <div data-testid="security-schema">
        {getSecuritySchema("test-security") ? "found" : "null"}
      </div>
    </div>
  )
}

describe("BaseSpecsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    window.location.hash = ""
    mockGetSectionId.mockImplementation((parts: string[]) => parts.join("-").toLowerCase())
    mockGetTagChildSidebarItems.mockReturnValue([])
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { getByText } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <div>Test Content</div>
        </BaseSpecsProvider>
      )
      expect(getByText("Test Content")).toBeInTheDocument()
    })
  })

  describe("useBaseSpecs hook", () => {
    test("throws error when used outside provider", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow("useBaseSpecs must be used inside a BaseSpecsProvider")

      consoleSpy.mockRestore()
    })

    test("returns baseSpecs and getSecuritySchema", () => {
      const { getByTestId } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <TestComponent />
        </BaseSpecsProvider>
      )
      expect(getByTestId("base-specs")).toHaveTextContent("present")
      expect(getByTestId("security-schema")).toBeInTheDocument()
    })
  })

  describe("getSecuritySchema", () => {
    test("returns security schema when it exists", () => {
      const { getByTestId } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <TestComponent />
        </BaseSpecsProvider>
      )
      const securitySchema = getByTestId("security-schema")
      expect(securitySchema).toHaveTextContent("found")
    })

    test("returns null when security schema does not exist", () => {
      const { getByTestId } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <TestComponent />
        </BaseSpecsProvider>
      )
      const securitySchema = getByTestId("security-schema")
      // Change to a non-existent security name
      const TestComponent2 = () => {
        const { getSecuritySchema } = useBaseSpecs()
        return (
          <div data-testid="security-schema-2">
            {getSecuritySchema("non-existent") ? "found" : "null"}
          </div>
        )
      }
      const { getByTestId: getByTestId2 } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <TestComponent2 />
        </BaseSpecsProvider>
      )
      expect(getByTestId2("security-schema-2")).toHaveTextContent("null")
    })

    test("returns null when security schema is a ref", () => {
      const baseSpecsWithRef: OpenAPI.ExpandedDocument = {
        ...mockBaseSpecs,
        components: {
          securitySchemes: {
            "test-security": {
              $ref: "#/components/securitySchemes/OtherSecurity",
            },
          },
        },
      } as OpenAPI.ExpandedDocument

      const TestComponent3 = () => {
        const { getSecuritySchema } = useBaseSpecs()
        return (
          <div data-testid="security-schema-3">
            {getSecuritySchema("test-security") ? "found" : "null"}
          </div>
        )
      }

      const { getByTestId } = render(
        <BaseSpecsProvider baseSpecs={baseSpecsWithRef}>
          <TestComponent3 />
        </BaseSpecsProvider>
      )
      expect(getByTestId("security-schema-3")).toHaveTextContent("null")
    })
  })

  describe("itemsToUpdate", () => {
    test("generates itemsToUpdate from baseSpecs tags", async () => {
      const mockSidebar: Sidebar.Sidebar = {
        sidebar_id: "test-sidebar",
        title: "Test Sidebar",
        items: [],
      }
      mockUseSidebar.mockReturnValue({
        activePath: "testtag",
        setActivePath: mockSetActivePath,
        resetItems: mockResetItems,
        updateItems: mockUpdateItems,
        shownSidebar: mockSidebar,
      })
      mockGetTagChildSidebarItems.mockReturnValue([
        {
          type: "link",
          path: "/test-path",
          title: "Test Link",
        },
      ])

      render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <div>Test</div>
        </BaseSpecsProvider>
      )

      await waitFor(() => {
        expect(mockUpdateItems).toHaveBeenCalled()
      })

      const updateCall = mockUpdateItems.mock.calls[0][0]
      expect(updateCall.sidebar_id).toBe("test-sidebar")
      expect(updateCall.items).toBeDefined()
      expect(Array.isArray(updateCall.items)).toBe(true)
      expect(updateCall.items.length).toBeGreaterThan(0)
    })

    test("does not update items when baseSpecs is undefined", () => {
      render(
        <BaseSpecsProvider baseSpecs={undefined}>
          <div>Test</div>
        </BaseSpecsProvider>
      )

      expect(mockUpdateItems).not.toHaveBeenCalled()
    })

    test("does not update items when shownSidebar is null", () => {
      mockUseSidebar.mockReturnValue({
        activePath: "testtag",
        setActivePath: mockSetActivePath,
        resetItems: mockResetItems,
        updateItems: mockUpdateItems,
        shownSidebar: undefined,
      })
      render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <div>Test</div>
        </BaseSpecsProvider>
      )

      expect(mockUpdateItems).not.toHaveBeenCalled()
    })

    test("includes onOpen handler that updates hash and activePath", async () => {
      mockUseSidebar.mockReturnValue({
        activePath: "something-else",
        setActivePath: mockSetActivePath,
        resetItems: mockResetItems,
        updateItems: mockUpdateItems,
        shownSidebar: mockShownSidebar,
      })
      window.location.hash = ""

      render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <div>Test</div>
        </BaseSpecsProvider>
      )

      await waitFor(() => {
        expect(mockUpdateItems).toHaveBeenCalled()
      })

      const updateCall = mockUpdateItems.mock.calls[0][0]
      const item = updateCall.items[0]
      expect(item.newItem.onOpen).toBeDefined()

      // Call onOpen
      item.newItem.onOpen()
      expect(mockPush).toHaveBeenCalledWith("#testtag", { scroll: false })
      expect(mockSetActivePath).toHaveBeenCalledWith("testtag")
    })

    test("onOpen does not update hash when it already matches", async () => {
      mockUseSidebar.mockReturnValue({
        activePath: "testtag",
        setActivePath: mockSetActivePath,
        resetItems: mockResetItems,
        updateItems: mockUpdateItems,
        shownSidebar: mockShownSidebar,
      })
      window.location.hash = "#testtag"

      render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <div>Test</div>
        </BaseSpecsProvider>
      )

      await waitFor(() => {
        expect(mockUpdateItems).toHaveBeenCalled()
      })

      const updateCall = mockUpdateItems.mock.calls[0][0]
      const item = updateCall.items[0]
      mockPush.mockClear()
      mockSetActivePath.mockClear()

      // Call onOpen
      item.newItem.onOpen()
      expect(mockPush).not.toHaveBeenCalled()
      expect(mockSetActivePath).not.toHaveBeenCalled()
    })
  })

  describe("cleanup", () => {
    test("calls resetItems on unmount", () => {
      const { unmount } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <div>Test</div>
        </BaseSpecsProvider>
      )

      unmount()
      expect(mockResetItems).toHaveBeenCalled()
    })
  })
})

