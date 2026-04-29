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
vi.mock("docs-ui", async () => {
  const actual = await vi.importActual<typeof React>("docs-ui")
  return {
    ...actual,
    Feedback: vi.fn(({ extraData }: { extraData: { area: string } }) => (
      <div data-testid="feedback" data-area={extraData.area}>Feedback</div>
    )),
  }
})

import {Feedback} from ".."

beforeEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("render", () => {
  test("render feedback component for store area", () => {
    const { getByTestId } = render(<Feedback />)
    const feedback = getByTestId("feedback")
    expect(feedback).toBeInTheDocument()
    expect(feedback).toHaveAttribute("data-area", "store")
  })

  test("render feedback component for admin area", () => {
    mockUseArea.mockReturnValue({ area: "admin" })
    const { getByTestId } = render(<Feedback />)
    const feedback = getByTestId("feedback")
    expect(feedback).toBeInTheDocument()
    expect(feedback).toHaveAttribute("data-area", "admin")
  })
})