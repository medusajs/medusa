import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock functions
const mockSetActivePath = vi.fn()
const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockUseActiveOnScroll = vi.fn((options: unknown) => ({
  activeItemId: "",
}))
const mockUseSidebar = vi.fn(() => ({
  setActivePath: mockSetActivePath,
}))
const mockUseRouter = vi.fn(() => ({
  push: mockPush,
  replace: mockReplace,
}))

// mock components
vi.mock("docs-ui", () => ({
  useActiveOnScroll: (options: unknown) => mockUseActiveOnScroll(options),
  useSidebar: () => mockUseSidebar(),
}))
vi.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
}))

import Section from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()

  window.history.scrollRestoration = "auto"
})

describe("rendering", () => {
  test("passes checkActiveOnScroll prop to useActiveOnScroll", () => {
    render(<Section checkActiveOnScroll>Test</Section>)
    expect(mockUseActiveOnScroll).toHaveBeenCalledWith({
      rootElm: undefined,
      enable: true,
      useDefaultIfNoActive: false,
      maxLevel: 2,
    })
  })
})

describe("effect hooks", () => {
  test("sets active path when active item id is not empty", () => {
    mockUseActiveOnScroll.mockReturnValue({
      activeItemId: "test",
    })
    render(<Section>Test</Section>)
    expect(mockSetActivePath).toHaveBeenCalledWith("test")
    expect(mockPush).toHaveBeenCalledWith("#test", { scroll: false })
  })

  test("does not set active path when active item id is empty", () => {
    mockUseActiveOnScroll.mockReturnValue({
      activeItemId: "",
    })
    render(<Section>Test</Section>)
    expect(mockSetActivePath).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  test("disables scroll restoration when history is available", () => {
    render(<Section>Test</Section>)
    expect(history.scrollRestoration).toBe("manual")
  })

  test("does not disable scroll restoration when history is not available", () => {
    delete (window.history as any).scrollRestoration
    render(<Section>Test</Section>)
    expect(history.scrollRestoration).not.toBe("manual")
  })
})