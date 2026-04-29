import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { ColorMode } from "../../../../../providers/ColorMode"

// mock functions
const mockSetColorMode = vi.fn()
// mock data
const defaultUseColorModeReturn = {
  colorMode: "light" as ColorMode,
  setColorMode: mockSetColorMode,
}
const mockUseColorMode = vi.fn(() => defaultUseColorModeReturn)

// mock components
vi.mock("@/providers/ColorMode", () => ({
  useColorMode: () => mockUseColorMode(),
}))

vi.mock("@medusajs/icons", () => ({
  EllipseMiniSolid: ({ className }: { className?: string }) => (
    <svg data-testid="ellipse-icon" className={className} />
  ),
}))

import { MainNavThemeMenu } from "../../ThemeMenu"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("default render", () => {
    const { container } = render(<MainNavThemeMenu />)
    expect(container).toHaveTextContent("Theme")
    expect(container).toHaveTextContent("Light")
    expect(container).toHaveTextContent("Dark")
  })

  test("shows selected icon for light mode when colorMode is light", () => {
    mockUseColorMode.mockReturnValueOnce({
      ...defaultUseColorModeReturn,
      colorMode: "light",
      setColorMode: mockSetColorMode,
    })
    const { container } = render(<MainNavThemeMenu />)
    const lightIcons = container.querySelectorAll(
      "[data-testid='ellipse-icon']"
    )
    expect(lightIcons[0]).not.toHaveClass("invisible")
    expect(lightIcons[1]).toHaveClass("invisible")
  })

  test("shows selected icon for dark mode when colorMode is dark", () => {
    mockUseColorMode.mockReturnValueOnce({
      ...defaultUseColorModeReturn,
      colorMode: "dark",
      setColorMode: mockSetColorMode,
    })
    const { container } = render(<MainNavThemeMenu />)
    const darkIcons = container.querySelectorAll("[data-testid='ellipse-icon']")
    expect(darkIcons[0]).toHaveClass("invisible")
    expect(darkIcons[1]).not.toHaveClass("invisible")
  })

  test("applies bold text for active mode", () => {
    mockUseColorMode.mockReturnValueOnce({
      ...defaultUseColorModeReturn,
      colorMode: "light",
      setColorMode: mockSetColorMode,
    })
    const { container } = render(<MainNavThemeMenu />)
    const lightSpan = Array.from(container.querySelectorAll("span")).find(
      (span) => span.textContent === "Light"
    )
    expect(lightSpan).toHaveClass("text-compact-small-plus")
  })

  test("applies normal text for inactive mode", () => {
    mockUseColorMode.mockReturnValueOnce({
      ...defaultUseColorModeReturn,
      colorMode: "dark",
      setColorMode: mockSetColorMode,
    })
    const { container } = render(<MainNavThemeMenu />)
    const lightSpan = Array.from(container.querySelectorAll("span")).find(
      (span) => span.textContent === "Light"
    )
    expect(lightSpan).toHaveClass("text-compact-small")
  })
})

describe("interaction", () => {
  test("calls setColorMode with 'light' when light option is clicked", () => {
    const { container } = render(<MainNavThemeMenu />)
    const lightOption = container.querySelector("[data-testid='light-option']")
    fireEvent.click(lightOption!)
    expect(mockSetColorMode).toHaveBeenCalledWith("light")
  })

  test("calls setColorMode with 'dark' when dark option is clicked", () => {
    const { container } = render(<MainNavThemeMenu />)
    const darkOption = container.querySelector("[data-testid='dark-option']")
    fireEvent.click(darkOption!)
    expect(mockSetColorMode).toHaveBeenCalledWith("dark")
  })
})
