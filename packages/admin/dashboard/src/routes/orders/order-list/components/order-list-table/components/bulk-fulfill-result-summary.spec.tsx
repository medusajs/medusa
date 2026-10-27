// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      return options ? `${key}:${JSON.stringify(options)}` : key
    },
  }),
}))

import { BulkFulfillResultSummary } from "./bulk-fulfill-result-summary"

afterEach(() => {
  cleanup()
})

describe("BulkFulfillResultSummary", () => {
  it("renders the succeeded/failed counts via i18n interpolation, with no per-order detail when nothing failed", () => {
    render(
      <BulkFulfillResultSummary
        result={{ succeeded: ["order_1", "order_2"], failed: [] }}
        onDismiss={() => {}}
      />
    )

    expect(
      screen.getByText(
        `orders.readyToShip.bulkFulfillSummary:${JSON.stringify({
          succeeded: 2,
          failed: 0,
        })}`
      )
    ).toBeTruthy()
    expect(screen.queryByText(/order_/)).toBeNull()
  })

  it("renders each failed order's own id and error message inline when there are failures", () => {
    render(
      <BulkFulfillResultSummary
        result={{
          succeeded: ["order_1"],
          failed: [
            {
              order_id: "order_2",
              error: "Unable to buy a shipping label: incomplete address",
            },
            { order_id: "order_3", error: "No shipping method" },
          ],
        }}
        onDismiss={() => {}}
      />
    )

    expect(
      screen.getByText(
        `orders.readyToShip.bulkFulfillSummary:${JSON.stringify({
          succeeded: 1,
          failed: 2,
        })}`
      )
    ).toBeTruthy()
    expect(
      screen.getByText(
        "order_2: Unable to buy a shipping label: incomplete address"
      )
    ).toBeTruthy()
    expect(screen.getByText("order_3: No shipping method")).toBeTruthy()
  })

  it("calls onDismiss when the close button is clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(
      <BulkFulfillResultSummary
        result={{ succeeded: ["order_1"], failed: [] }}
        onDismiss={onDismiss}
      />
    )

    await user.click(screen.getByRole("button", { name: "actions.close" }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
