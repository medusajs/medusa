import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import SidebarProvider from "../sidebar"
import { Sidebar } from "types"

// Mock functions
const mockIsLoading = vi.fn(() => false)
const mockSetIsLoading = vi.fn()
const mockUsePageLoading = vi.fn(() => ({
  isLoading: mockIsLoading(),
  setIsLoading: mockSetIsLoading,
}))
const mockScrollableElement = vi.fn(() => null as HTMLElement | null)
const mockUseScrollController = vi.fn(() => ({
  scrollableElement: mockScrollableElement(),
}))
const mockPathname = vi.fn(() => "/store/test")
const mockUsePathname = vi.fn(() => mockPathname())

const mockStoreSidebar: Sidebar.Sidebar = {
  sidebar_id: "store-sidebar",
  title: "Store Sidebar",
  items: [],
}

const mockAdminSidebar: Sidebar.Sidebar = {
  sidebar_id: "admin-sidebar",
  title: "Admin Sidebar",
  items: [],
}

vi.mock("docs-ui", () => ({
  SidebarProvider: ({
    children,
    isLoading,
    setIsLoading,
    shouldHandleHashChange,
    shouldHandlePathChange,
    scrollableElement,
    sidebars,
    persistCategoryState,
    disableActiveTransition,
    isSidebarStatic,
  }: {
    children: React.ReactNode
    isLoading: boolean
    setIsLoading: (value: boolean) => void
    shouldHandleHashChange: boolean
    shouldHandlePathChange: boolean
    scrollableElement: HTMLElement | null
    sidebars: Sidebar.Sidebar[]
    persistCategoryState: boolean
    disableActiveTransition: boolean
    isSidebarStatic: boolean
  }) => (
    <div
      data-testid="ui-sidebar-provider"
      data-is-loading={isLoading.toString()}
      data-should-handle-hash-change={shouldHandleHashChange.toString()}
      data-should-handle-path-change={shouldHandlePathChange.toString()}
      data-scrollable-element={scrollableElement ? "present" : "null"}
      data-sidebars={JSON.stringify(sidebars)}
      data-persist-category-state={persistCategoryState.toString()}
      data-disable-active-transition={disableActiveTransition.toString()}
      data-is-sidebar-static={isSidebarStatic.toString()}
    >
      {children}
    </div>
  ),
  usePageLoading: () => mockUsePageLoading(),
  useScrollController: () => mockUseScrollController(),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

vi.mock("@/config", () => ({
  config: {
    sidebars: [{
      sidebar_id: "store-sidebar",
      title: "Store Sidebar",
      items: [],
    }],
  },
}))

// Mock dynamic imports
vi.mock("@/generated/generated-store-sidebar.mjs", () => ({
  default: mockStoreSidebar,
}))

vi.mock("@/generated/generated-admin-sidebar.mjs", () => ({
  default: mockAdminSidebar,
}))

describe("SidebarProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    mockIsLoading.mockReturnValue(false)
    mockScrollableElement.mockReturnValue(null)
    mockPathname.mockReturnValue("/store/test")
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { getByText } = render(
        <SidebarProvider>
          <div>Test Content</div>
        </SidebarProvider>
      )
      expect(getByText("Test Content")).toBeInTheDocument()
    })

    test("renders UiSidebarProvider with correct props", async () => {
      const { getByTestId } = render(
        <SidebarProvider>
          <div>Test</div>
        </SidebarProvider>
      )

      await waitFor(() => {
        const uiProvider = getByTestId("ui-sidebar-provider")
        expect(uiProvider).toBeInTheDocument()
        expect(uiProvider.getAttribute("data-is-loading")).toBe("false")
        expect(uiProvider.getAttribute("data-should-handle-hash-change")).toBe("true")
        expect(uiProvider.getAttribute("data-should-handle-path-change")).toBe("false")
        expect(uiProvider.getAttribute("data-persist-category-state")).toBe("false")
        expect(uiProvider.getAttribute("data-disable-active-transition")).toBe("false")
        expect(uiProvider.getAttribute("data-is-sidebar-static")).toBe("false")
      })
    })
  })

  describe("sidebar loading", () => {
    test("loads store sidebar when path starts with /store", async () => {
      mockPathname.mockReturnValue("/store/test")
      const { getByTestId } = render(
        <SidebarProvider>
          <div>Test</div>
        </SidebarProvider>
      )

      await waitFor(() => {
        const uiProvider = getByTestId("ui-sidebar-provider")
        const sidebars = JSON.parse(uiProvider.getAttribute("data-sidebars") || "[]")
        expect(sidebars).toEqual([mockStoreSidebar])
      })
    })

    test("loads admin sidebar when path does not start with /store", async () => {
      mockPathname.mockReturnValue("/admin/test")
      const { getByTestId } = render(
        <SidebarProvider>
          <div>Test</div>
        </SidebarProvider>
      )

      await waitFor(() => {
        const uiProvider = getByTestId("ui-sidebar-provider")
        const sidebars = JSON.parse(uiProvider.getAttribute("data-sidebars") || "[]")
        expect(sidebars).toEqual([mockAdminSidebar])
      })
    })

    test("uses config sidebars as fallback when sidebar is not loaded", () => {
      const { getByTestId } = render(
        <SidebarProvider>
          <div>Test</div>
        </SidebarProvider>
      )

      // Initially should use config sidebars
      const uiProvider = getByTestId("ui-sidebar-provider")
      const sidebars = JSON.parse(uiProvider.getAttribute("data-sidebars") || "[]")
      expect(sidebars).toEqual([mockStoreSidebar])
    })
  })

  describe("props passing", () => {
    test("passes isLoading and setIsLoading to UiSidebarProvider", async () => {
      mockIsLoading.mockReturnValue(true)
      const { getByTestId } = render(
        <SidebarProvider>
          <div>Test</div>
        </SidebarProvider>
      )

      await waitFor(() => {
        const uiProvider = getByTestId("ui-sidebar-provider")
        expect(uiProvider.getAttribute("data-is-loading")).toBe("true")
      })
    })

    test("passes scrollableElement to UiSidebarProvider", async () => {
      const mockElement = document.createElement("div")
      mockScrollableElement.mockReturnValue(mockElement)
      const { getByTestId } = render(
        <SidebarProvider>
          <div>Test</div>
        </SidebarProvider>
      )

      await waitFor(() => {
        const uiProvider = getByTestId("ui-sidebar-provider")
        expect(uiProvider.getAttribute("data-scrollable-element")).toBe("present")
      })
    })
  })

  describe("error handling", () => {
    test("handles sidebar loading errors gracefully", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      
      // Mock a failing import
      vi.doMock("../generated/generated-store-sidebar.mjs", () => {
        throw new Error("Failed to load sidebar")
      })

      const { getByTestId } = render(
        <SidebarProvider>
          <div>Test</div>
        </SidebarProvider>
      )

      await waitFor(() => {
        const uiProvider = getByTestId("ui-sidebar-provider")
        expect(uiProvider).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })
  })
})

