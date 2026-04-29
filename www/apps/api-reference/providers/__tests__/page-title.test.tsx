import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import PageTitleProvider from "../page-title"
import { Sidebar } from "types"

// Mock functions
const mockUseSidebar = vi.fn(() => ({
  activePath: "test-path" as string | null,
  activeItem: {
    type: "link",
    path: "test-path",
    title: "Test Item",
  },
}))
const mockUseArea = vi.fn(() => ({
  displayedArea: "Store",
}))

vi.mock("docs-ui", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("@/providers/area", () => ({
  useArea: () => mockUseArea(),
}))

describe("PageTitleProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    document.title = ""
    mockUseSidebar.mockReturnValue({
      activePath: "test-path",
      activeItem: {
        type: "link",
        path: "test-path",
        title: "Test Item",
      },
    })
    mockUseArea.mockReturnValue({
      displayedArea: "Store",
    })
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { getByText } = render(
        <PageTitleProvider>
          <div>Test Content</div>
        </PageTitleProvider>
      )
      expect(getByText("Test Content")).toBeInTheDocument()
    })
  })

  describe("document title", () => {
    test("sets title to suffix when activePath is null", () => {
      mockUseSidebar.mockReturnValue({
        activePath: null,
        activeItem: {
          type: "link",
          path: "test-path",
          title: "Test Item",
        },
      })
      render(
        <PageTitleProvider>
          <div>Test</div>
        </PageTitleProvider>
      )
      expect(document.title).toBe("Medusa Store API Reference")
    })

    test("sets title to suffix when activePath is empty string", () => {
      mockUseSidebar.mockReturnValue({
        activePath: "",
        activeItem: {
          type: "link",
          path: "test-path",
          title: "Test Item",
        },
      })
      render(
        <PageTitleProvider>
          <div>Test</div>
        </PageTitleProvider>
      )
      expect(document.title).toBe("Medusa Store API Reference")
    })

    test("sets title with activeItem title when activeItem.path matches activePath", () => {
      const mockItem: Sidebar.SidebarItemLink = {
        type: "link",
        path: "/test-path",
        title: "Test Item",
      }
      mockUseSidebar.mockReturnValue({
        activePath: "/test-path",
        activeItem: mockItem,
      })

      render(
        <PageTitleProvider>
          <div>Test</div>
        </PageTitleProvider>
      )

      expect(document.title).toBe("Test Item - Medusa Store API Reference")
    })

    test("sets title with child item title when activeItem has matching child", () => {
      const mockChildItem: Sidebar.SidebarItemLink = {
        type: "link",
        path: "/child-path",
        title: "Child Item",
      }
      const mockItem: Sidebar.SidebarItemLink = {
        type: "link",
        path: "/parent-path",
        title: "Parent Item",
        children: [mockChildItem],
      }
      mockUseSidebar.mockReturnValue({
        activePath: "/child-path",
        activeItem: mockItem,
      })

      render(
        <PageTitleProvider>
          <div>Test</div>
        </PageTitleProvider>
      )

      expect(document.title).toBe("Child Item - Medusa Store API Reference")
    })

    test("sets title to suffix when activeItem has no matching child", () => {
      const mockItem: Sidebar.SidebarItemLink = {
        type: "link",
        path: "/parent-path",
        title: "Parent Item",
        children: [
          {
            type: "link",
            path: "/other-path",
            title: "Other Item",
          },
        ],
      }
      mockUseSidebar.mockReturnValue({
        activePath: "/child-path",
        activeItem: mockItem,
      })

      render(
        <PageTitleProvider>
          <div>Test</div>
        </PageTitleProvider>
      )

      expect(document.title).toBe("Medusa Store API Reference")
    })

    test("updates title when displayedArea changes", () => {
      mockUseArea.mockReturnValue({
        displayedArea: "Admin",
      })
      render(
        <PageTitleProvider>
          <div>Test</div>
        </PageTitleProvider>
      )
      expect(document.title).toBe("Test Item - Medusa Admin API Reference")
    })

    test("updates title when activePath changes", () => {
      const { rerender } = render(
        <PageTitleProvider>
          <div>Test</div>
        </PageTitleProvider>
      )

      expect(document.title).toBe("Test Item - Medusa Store API Reference")

      const mockItem: Sidebar.SidebarItemLink = {
        type: "link",
        path: "/new-path",
        title: "New Item",
      }
      mockUseSidebar.mockReturnValue({
        activePath: "/new-path",
        activeItem: mockItem,
      })

      rerender(
        <PageTitleProvider>
          <div>Test</div>
        </PageTitleProvider>
      )

      expect(document.title).toBe("New Item - Medusa Store API Reference")
    })
  })
})

