import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { PageLoadingProvider, usePageLoading } from "../index"

const TestComponent = () => {
  const { isLoading, setIsLoading } = usePageLoading()
  return (
    <div>
      <div data-testid="loading">{isLoading ? "loading" : "loaded"}</div>
      <button data-testid="set-loading" onClick={() => setIsLoading(true)}>
        Set Loading
      </button>
      <button data-testid="set-loaded" onClick={() => setIsLoading(false)}>
        Set Loaded
      </button>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe("rendering", () => {
  test("renders children", () => {
    const { container } = render(
      <PageLoadingProvider>
        <div>Test</div>
      </PageLoadingProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("usePageLoading hook", () => {
  test("defaults to loading true", () => {
    const { getByTestId } = render(
      <PageLoadingProvider>
        <TestComponent />
      </PageLoadingProvider>
    )

    expect(getByTestId("loading")).toHaveTextContent("loading")
  })

  test("setIsLoading updates isLoading state", () => {
    const { getByTestId } = render(
      <PageLoadingProvider>
        <TestComponent />
      </PageLoadingProvider>
    )

    expect(getByTestId("loading")).toHaveTextContent("loading")

    fireEvent.click(getByTestId("set-loaded"))

    expect(getByTestId("loading")).toHaveTextContent("loaded")

    fireEvent.click(getByTestId("set-loading"))

    expect(getByTestId("loading")).toHaveTextContent("loading")
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("usePageLoading must be used inside a PageLoadingProvider")

    consoleSpy.mockRestore()
  })
})
