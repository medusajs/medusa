import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock hooks
const mockUseArea = vi.fn(() => ({
  area: "store",
}))

// mock components
vi.mock("@/providers/area", () => ({
  useArea: () => mockUseArea(),
}))

import DownloadFull from ".."

beforeEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("render", () => {
  test("render download link for store area", () => {
    const { getByTestId } = render(<DownloadFull />)
    const link = getByTestId("download-full-link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/download/store")
    expect(link).toHaveAttribute("download")
    expect(link).toHaveAttribute("target", "_blank")
  })

  test("render download link for admin area", () => {
    mockUseArea.mockReturnValue({ area: "admin" })
    const { getByTestId } = render(<DownloadFull />)
    const link = getByTestId("download-full-link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/download/admin")
    expect(link).toHaveAttribute("download")
    expect(link).toHaveAttribute("target", "_blank")
  })
})