import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { MobileProvider, useMobile } from "../index"

const TestComponent = () => {
  const { isMobile } = useMobile()
  return <div data-testid="mobile">{isMobile ? "mobile" : "desktop"}</div>
}

beforeEach(() => {
  vi.clearAllMocks()
  // Reset window.innerWidth
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
      <MobileProvider>
        <div>Test</div>
      </MobileProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("useMobile hook", () => {
  test("detects desktop when window width >= 1024", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { getByTestId } = render(
      <MobileProvider>
        <TestComponent />
      </MobileProvider>
    )

    await waitFor(() => {
      expect(getByTestId("mobile")).toHaveTextContent("desktop")
    })
  })

  test("detects mobile when window width < 1024", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    })

    const { getByTestId } = render(
      <MobileProvider>
        <TestComponent />
      </MobileProvider>
    )

    await waitFor(() => {
      expect(getByTestId("mobile")).toHaveTextContent("mobile")
    })
  })

  test("updates when window is resized to mobile", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { getByTestId } = render(
      <MobileProvider>
        <TestComponent />
      </MobileProvider>
    )

    await waitFor(() => {
      expect(getByTestId("mobile")).toHaveTextContent("desktop")
    })

    // Simulate resize to mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    })

    window.dispatchEvent(new Event("resize"))

    await waitFor(() => {
      expect(getByTestId("mobile")).toHaveTextContent("mobile")
    })
  })

  test("updates when window is resized to desktop", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    })

    const { getByTestId } = render(
      <MobileProvider>
        <TestComponent />
      </MobileProvider>
    )

    await waitFor(() => {
      expect(getByTestId("mobile")).toHaveTextContent("mobile")
    })

    // Simulate resize to desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    window.dispatchEvent(new Event("resize"))

    await waitFor(() => {
      expect(getByTestId("mobile")).toHaveTextContent("desktop")
    })
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useMobile must be used within a MobileProvider")

    consoleSpy.mockRestore()
  })
})
