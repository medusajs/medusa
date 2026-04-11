import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { BrowserProvider, useIsBrowser } from "../index"

const TestComponent = () => {
  const { isBrowser } = useIsBrowser()
  return <div data-testid="test">{isBrowser ? "browser" : "server"}</div>
}

describe("BrowserProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { container } = render(
        <BrowserProvider>
          <div>Test</div>
        </BrowserProvider>
      )
      expect(container).toHaveTextContent("Test")
    })
  })

  describe("useIsBrowser hook", () => {
    test("returns isBrowser as true after mount", async () => {
      const { getByTestId } = render(
        <BrowserProvider>
          <TestComponent />
        </BrowserProvider>
      )

      await waitFor(() => {
        expect(getByTestId("test")).toHaveTextContent("browser")
      })
    })

    test("throws error when used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow("useIsBrowser must be used within a BrowserProvider")

      consoleSpy.mockRestore()
    })
  })
})
