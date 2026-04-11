import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import LoadingProvider, { useLoading } from "../loading"

// Test component that uses the hook
const TestComponent = () => {
  const { loading, removeLoading } = useLoading()
  return (
    <div>
      <div data-testid="loading-state">{loading.toString()}</div>
      <button data-testid="remove-loading" onClick={removeLoading}>
        Remove Loading
      </button>
    </div>
  )
}

describe("LoadingProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { getByText } = render(
        <LoadingProvider>
          <div>Test Content</div>
        </LoadingProvider>
      )
      expect(getByText("Test Content")).toBeInTheDocument()
    })
  })

  describe("initial loading state", () => {
    test("initializes with loading false by default", () => {
      const { getByTestId } = render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      )
      expect(getByTestId("loading-state")).toHaveTextContent("false")
    })

    test("initializes with loading true when initialLoading is true", () => {
      const { getByTestId } = render(
        <LoadingProvider initialLoading={true}>
          <TestComponent />
        </LoadingProvider>
      )
      expect(getByTestId("loading-state")).toHaveTextContent("true")
    })
  })

  describe("removeLoading", () => {
    test("sets loading to false when removeLoading is called", () => {
      const { getByTestId } = render(
        <LoadingProvider initialLoading={true}>
          <TestComponent />
        </LoadingProvider>
      )
      const removeLoadingButton = getByTestId("remove-loading")
      const loadingState = getByTestId("loading-state")

      expect(loadingState).toHaveTextContent("true")
      fireEvent.click(removeLoadingButton)
      expect(loadingState).toHaveTextContent("false")
    })
  })

  describe("useLoading hook", () => {
    test("throws error when used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow("useLoading must be used inside a LoadingProvider")

      consoleSpy.mockRestore()
    })

    test("returns loading state and removeLoading function", () => {
      const { getByTestId } = render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      )
      expect(getByTestId("loading-state")).toBeInTheDocument()
      expect(getByTestId("remove-loading")).toBeInTheDocument()
    })
  })
})

