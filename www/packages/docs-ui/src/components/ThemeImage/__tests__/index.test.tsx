import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock hooks
const mockColorMode = "light"

const defaultUseColorModeReturn = {
  colorMode: mockColorMode,
}

const mockUseColorMode = vi.fn(() => defaultUseColorModeReturn)

vi.mock("@/providers/ColorMode", () => ({
  useColorMode: () => mockUseColorMode(),
}))

import { ThemeImage } from "../../ThemeImage"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseColorMode.mockReturnValue(defaultUseColorModeReturn)
})

describe("rendering", () => {
  test("renders image", () => {
    const { container } = render(<ThemeImage light="/light.png" />)
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
  })

  test("renders light image when colorMode is light", () => {
    mockUseColorMode.mockReturnValue({ colorMode: "light" })
    const { container } = render(<ThemeImage light="/light.png" />)
    const img = container.querySelector("img")
    expect(img).toHaveAttribute("src", "/light.png")
  })

  test("renders dark image when colorMode is dark and dark prop is provided", () => {
    mockUseColorMode.mockReturnValue({ colorMode: "dark" })
    const { container } = render(
      <ThemeImage light="/light.png" dark="/dark.png" />
    )
    const img = container.querySelector("img")
    expect(img).toHaveAttribute("src", "/dark.png")
  })

  test("renders light image when colorMode is dark but dark prop is not provided", () => {
    mockUseColorMode.mockReturnValue({ colorMode: "dark" })
    const { container } = render(<ThemeImage light="/light.png" />)
    const img = container.querySelector("img")
    expect(img).toHaveAttribute("src", "/light.png")
  })

  test("renders alt text", () => {
    const { container } = render(
      <ThemeImage light="/light.png" alt="Test Image" />
    )
    const img = container.querySelector("img")
    expect(img).toHaveAttribute("alt", "Test Image")
  })

  test("passes through other props", () => {
    const { container } = render(
      <ThemeImage light="/light.png" className="custom-class" width={100} />
    )
    const img = container.querySelector("img")
    expect(img).toHaveClass("custom-class")
    expect(img).toHaveAttribute("width", "100")
  })
})
