import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { CloudStatus } from "types"

// mock functions
const mockGetCloudStatus = vi.fn()

vi.mock("@/utils/get-cloud-status", () => ({
  getCloudStatus: () => mockGetCloudStatus(),
}))

import { ContentMenuCloudStatus } from "../index"

const operationalStatus: CloudStatus = {
  indicator: "none",
  description: "All Systems Operational",
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetCloudStatus.mockResolvedValue(operationalStatus)
})

afterEach(() => {
  cleanup()
})

describe("ContentMenuCloudStatus", () => {
  test("renders a badge linking to the status page", async () => {
    render(<ContentMenuCloudStatus />)

    const link = await screen.findByTestId("content-menu-cloud-status")

    expect(link).toHaveAttribute("href", "https://status.medusajs.com")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveTextContent("Medusa Cloud")
  })

  test("shows the status description in a tooltip", async () => {
    render(<ContentMenuCloudStatus />)

    const link = await screen.findByTestId("content-menu-cloud-status")

    expect(link.querySelector("[data-tooltip-content]")).toHaveAttribute(
      "data-tooltip-content",
      "All Systems Operational"
    )
  })

  test("exposes the actual status description, which the label doesn't show", async () => {
    render(<ContentMenuCloudStatus />)

    const link = await screen.findByTestId("content-menu-cloud-status")

    expect(link.getAttribute("aria-label")).toContain("All Systems Operational")
    // a native title would stack a second tooltip on top of the react-tooltip
    expect(link).not.toHaveAttribute("title")
  })

  test.each([
    ["none", "green"],
    ["maintenance", "blue"],
    ["minor", "orange"],
    ["major", "orange"],
    ["critical", "red"],
  ] as const)(
    "uses the %s indicator's color on the block",
    async (indicator, expectedColor) => {
      mockGetCloudStatus.mockResolvedValue({
        indicator,
        description: "Some status",
      })

      render(<ContentMenuCloudStatus />)

      const block = await screen.findByTestId(
        "content-menu-cloud-status-indicator"
      )

      expect(block.className).toContain(`bg-medusa-tag-${expectedColor}-icon`)
    }
  )

  test("falls back to a neutral block for an unknown indicator", async () => {
    mockGetCloudStatus.mockResolvedValue({
      indicator: "something-new",
      description: "Some status",
    })

    render(<ContentMenuCloudStatus />)

    const block = await screen.findByTestId(
      "content-menu-cloud-status-indicator"
    )

    expect(block.className).toContain("bg-medusa-tag-neutral-icon")
  })

  test("has a transparent background that fills the width, and a hover background", async () => {
    render(<ContentMenuCloudStatus />)

    const link = await screen.findByTestId("content-menu-cloud-status")

    expect(link.className).toContain("w-full")
    expect(link.className).toContain("hover:bg-medusa-bg-base-hover")
    // no background class of its own, so it stays transparent until hovered
    expect(link.className).not.toMatch(/(^|\s)bg-/)
  })

  test("renders nothing until the status is loaded", () => {
    const { container } = render(<ContentMenuCloudStatus />)

    expect(container).toBeEmptyDOMElement()
  })

  test("renders nothing if the status can't be loaded", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    mockGetCloudStatus.mockRejectedValue(new Error("network error"))

    const { container } = render(<ContentMenuCloudStatus />)

    await waitFor(() => expect(consoleError).toHaveBeenCalled())
    expect(container).toBeEmptyDOMElement()

    consoleError.mockRestore()
  })
})
