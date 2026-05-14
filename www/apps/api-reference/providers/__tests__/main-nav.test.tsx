import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { MainNavProvider } from "../main-nav"

// Mock functions
const mockGetNavDropdownItems = vi.fn((options: unknown) => [
  {
    title: "Test Item",
    path: "/test",
  },
])

vi.mock("docs-ui", () => ({
  getNavDropdownItems: (options: unknown) => mockGetNavDropdownItems(options),
  MainNavProvider: ({ children, navItems }: { children: React.ReactNode; navItems: unknown[] }) => (
    <div data-testid="ui-main-nav-provider" data-nav-items={JSON.stringify(navItems)}>
      {children}
    </div>
  ),
}))

vi.mock("@/config", () => ({
  config: {
    baseUrl: "https://test.com",
  },
}))

describe("MainNavProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { getByText } = render(
        <MainNavProvider>
          <div>Test Content</div>
        </MainNavProvider>
      )
      expect(getByText("Test Content")).toBeInTheDocument()
    })

    test("renders UiMainNavProvider with navItems", () => {
      const { getByTestId } = render(
        <MainNavProvider>
          <div>Test</div>
        </MainNavProvider>
      )
      const uiProvider = getByTestId("ui-main-nav-provider")
      expect(uiProvider).toBeInTheDocument()
      expect(mockGetNavDropdownItems).toHaveBeenCalledWith({
        basePath: "https://test.com",
      })
    })
  })

  describe("navigationDropdownItems", () => {
    test("memoizes navigationDropdownItems", () => {
      const { rerender } = render(
        <MainNavProvider>
          <div>Test</div>
        </MainNavProvider>
      )

      const callCount = mockGetNavDropdownItems.mock.calls.length

      rerender(
        <MainNavProvider>
          <div>Test</div>
        </MainNavProvider>
      )

      // Should not call getNavDropdownItems again due to memoization
      expect(mockGetNavDropdownItems.mock.calls.length).toBe(callCount)
    })
  })
})

