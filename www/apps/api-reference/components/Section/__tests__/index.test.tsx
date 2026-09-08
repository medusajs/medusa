import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock functions
const mockSetActivePath = vi.fn()
const mockUseActiveOnScroll = vi.fn((options: unknown) => ({
  activeItemId: "",
}))
const mockUseSidebar = vi.fn(() => ({
  setActivePath: mockSetActivePath,
}))

// mock components
vi.mock("docs-ui", () => ({
  useActiveOnScroll: (options: unknown) => mockUseActiveOnScroll(options),
  useSidebar: () => mockUseSidebar(),
  getLinkWithBasePath: (path: string) => path,
}))
vi.mock("@/providers/area", () => ({
  useArea: () => ({ area: "store" }),
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
  test("sets active path to the section page path when active item id is not empty", () => {
    mockUseActiveOnScroll.mockReturnValue({
      activeItemId: "test",
    })
    const replaceStateSpy = vi.spyOn(window.history, "replaceState")
    render(<Section>Test</Section>)
    expect(mockSetActivePath).toHaveBeenCalledWith("/store/test")
    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/store/test")
    replaceStateSpy.mockRestore()
  })

  test("maps the introduction heading to the area index path", () => {
    mockUseActiveOnScroll.mockReturnValue({
      activeItemId: "introduction",
    })
    render(<Section>Test</Section>)
    expect(mockSetActivePath).toHaveBeenCalledWith("/store")
  })

  test("does not set active path when active item id is empty", () => {
    mockUseActiveOnScroll.mockReturnValue({
      activeItemId: "",
    })
    const replaceStateSpy = vi.spyOn(window.history, "replaceState")
    render(<Section>Test</Section>)
    expect(mockSetActivePath).not.toHaveBeenCalled()
    expect(replaceStateSpy).not.toHaveBeenCalled()
    replaceStateSpy.mockRestore()
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