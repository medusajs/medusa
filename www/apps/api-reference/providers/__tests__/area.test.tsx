import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { usePathname } from "next/navigation"
import AreaProvider, { useArea } from "../area"
import { OpenAPI } from "types"

// Mock functions
const mockSetActivePath = vi.fn()
const mockUseSidebar = vi.fn(() => ({
  setActivePath: mockSetActivePath,
}))
const mockUsePathname = vi.fn(() => "/store/test")
const mockCapitalize = vi.fn((str: string) => str.charAt(0).toUpperCase() + str.slice(1))
// Track previous values for usePrevious mock
// usePrevious returns the value from the previous render
let previousValue: unknown = undefined
const mockUsePrevious = vi.fn((value: unknown) => {
  const result = previousValue
  previousValue = value
  return result
})

// Test component that uses the hook
const TestComponent = () => {
  const { area, prevArea, displayedArea, setArea } = useArea()
  return (
    <div>
      <div data-testid="area">{area}</div>
      <div data-testid="prev-area">{prevArea || "undefined"}</div>
      <div data-testid="displayed-area">{displayedArea}</div>
      <button
        data-testid="set-area-store"
        onClick={() => setArea("store" as OpenAPI.Area)}
      >
        Set Store
      </button>
      <button
        data-testid="set-area-admin"
        onClick={() => setArea("admin" as OpenAPI.Area)}
      >
        Set Admin
      </button>
    </div>
  )
}

vi.mock("docs-ui", () => ({
  capitalize: (str: string) => mockCapitalize(str),
  usePrevious: (value: unknown) => mockUsePrevious(value),
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

describe("AreaProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    previousValue = undefined
    mockUsePathname.mockReturnValue("/store/test")
    mockCapitalize.mockImplementation((str: string) => str.charAt(0).toUpperCase() + str.slice(1))
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { getByText } = render(
        <AreaProvider area="store">
          <div>Test Content</div>
        </AreaProvider>
      )
      expect(getByText("Test Content")).toBeInTheDocument()
    })
  })

  describe("initial state", () => {
    test("initializes with passed area", () => {
      const { getByTestId } = render(
        <AreaProvider area="store">
          <TestComponent />
        </AreaProvider>
      )
      expect(getByTestId("area")).toHaveTextContent("store")
    })

    test("displays capitalized area", () => {
      const { getByTestId } = render(
        <AreaProvider area="store">
          <TestComponent />
        </AreaProvider>
      )
      expect(getByTestId("displayed-area")).toHaveTextContent("Store")
      expect(mockCapitalize).toHaveBeenCalledWith("store")
    })

    test("prevArea is undefined initially", () => {
      const { getByTestId } = render(
        <AreaProvider area="store">
          <TestComponent />
        </AreaProvider>
      )
      expect(getByTestId("prev-area")).toHaveTextContent("undefined")
    })
  })

  describe("setArea", () => {
    test("updates area when setArea is called", () => {
      const { getByTestId } = render(
        <AreaProvider area="store">
          <TestComponent />
        </AreaProvider>
      )
      const setAdminButton = getByTestId("set-area-admin")
      const areaElement = getByTestId("area")

      expect(areaElement).toHaveTextContent("store")
      fireEvent.click(setAdminButton)
      expect(areaElement).toHaveTextContent("admin")
    })

    test("updates displayedArea when area changes", () => {
      const { getByTestId } = render(
        <AreaProvider area="store">
          <TestComponent />
        </AreaProvider>
      )
      const setAdminButton = getByTestId("set-area-admin")
      const displayedAreaElement = getByTestId("displayed-area")

      expect(displayedAreaElement).toHaveTextContent("Store")
      fireEvent.click(setAdminButton)
      expect(displayedAreaElement).toHaveTextContent("Admin")
    })
  })

  describe("useEffect behavior", () => {
    test("calls setActivePath(null) when pathname changes", () => {
      const { rerender } = render(
        <AreaProvider area="store">
          <TestComponent />
        </AreaProvider>
      )

      mockUsePathname.mockReturnValue("/admin/test")
      rerender(
        <AreaProvider area="store">
          <TestComponent />
        </AreaProvider>
      )

      expect(mockSetActivePath).toHaveBeenCalledWith(null)
    })
  })

  describe("useArea hook", () => {
    test("throws error when used outside provider", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow("useAreaProvider must be used inside an AreaProvider")

      consoleSpy.mockRestore()
    })

    test("returns area, prevArea, displayedArea, and setArea", () => {
      const { getByTestId } = render(
        <AreaProvider area="store">
          <TestComponent />
        </AreaProvider>
      )
      expect(getByTestId("area")).toBeInTheDocument()
      expect(getByTestId("prev-area")).toBeInTheDocument()
      expect(getByTestId("displayed-area")).toBeInTheDocument()
      expect(getByTestId("set-area-store")).toBeInTheDocument()
      expect(getByTestId("set-area-admin")).toBeInTheDocument()
    })
  })
})

