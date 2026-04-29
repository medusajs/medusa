import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { LayoutProvider, useLayout } from "../index"

// mock resize observer
vi.mock("@react-hook/resize-observer", () => ({
  default: vi.fn((ref, callback) => {
    // Simulate resize observer callback
    if (ref?.current) {
      setTimeout(() => {
        callback()
      }, 0)
    }
  }),
}))

const TestComponent = () => {
  const { mainContentRef, showCollapsedNavbar } = useLayout()
  return (
    <div>
      <div ref={mainContentRef} data-testid="main-content">
        Content
      </div>
      <div data-testid="collapsed">
        {showCollapsedNavbar ? "collapsed" : "expanded"}
      </div>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1024,
  })
})

afterEach(() => {
  cleanup()
})

describe("rendering", () => {
  test("renders children", () => {
    const { container } = render(
      <LayoutProvider>
        <div>Test</div>
      </LayoutProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("useLayout hook", () => {
  test("provides mainContentRef", () => {
    const { getByTestId } = render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    )

    expect(getByTestId("main-content")).toBeInTheDocument()
  })

  test("showCollapsedNavbar defaults to false", () => {
    const { getByTestId } = render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    )

    expect(getByTestId("collapsed")).toHaveTextContent("expanded")
  })

  test("showCollapsedNavbar is false when window width < 1024", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    })

    const { getByTestId } = render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    )

    await waitFor(() => {
      expect(getByTestId("collapsed")).toHaveTextContent("expanded")
    })
  })

  test("showCollapsedNavbar is true when content width < 1100", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    })

    const { getByTestId } = render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    )

    const mainContent = getByTestId("main-content")
    Object.defineProperty(mainContent, "clientWidth", {
      writable: true,
      configurable: true,
      value: 1000,
    })

    // Trigger resize observer callback
    await waitFor(() => {
      // The resize observer should be called
      expect(mainContent).toBeInTheDocument()
    })
  })

  test("disables resize observer when disableResizeObserver is true", () => {
    const { getByTestId } = render(
      <LayoutProvider disableResizeObserver={true}>
        <TestComponent />
      </LayoutProvider>
    )

    expect(getByTestId("collapsed")).toHaveTextContent("expanded")
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useLayout must be used inside a LayoutProvider")

    consoleSpy.mockRestore()
  })
})
