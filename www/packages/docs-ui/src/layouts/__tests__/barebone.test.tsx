import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

const mockGoogleAnalytics = vi.fn(() => <script data-testid="ga-script" />)

vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: (props: { gaId: string }) => mockGoogleAnalytics(props),
}))

import { BareboneLayout } from "../barebone"

describe("BareboneLayout", () => {
  test("does not render GoogleAnalytics when gaId is not provided", () => {
    const { queryByTestId } = render(
      <BareboneLayout>
        <div>content</div>
      </BareboneLayout>
    )
    expect(queryByTestId("ga-script")).not.toBeInTheDocument()
    expect(mockGoogleAnalytics).not.toHaveBeenCalled()
  })

  test("renders GoogleAnalytics with the provided gaId", () => {
    const { queryByTestId } = render(
      <BareboneLayout gaId="G-TESTID">
        <div>content</div>
      </BareboneLayout>
    )
    expect(queryByTestId("ga-script")).toBeInTheDocument()
    expect(mockGoogleAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({ gaId: "G-TESTID" })
    )
  })
})
