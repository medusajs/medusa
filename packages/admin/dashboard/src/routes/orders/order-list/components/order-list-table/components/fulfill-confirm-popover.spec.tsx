// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TooltipProvider } from "@medusajs/ui"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

const mutateAsync = vi.fn()

// `fulfill-confirm-popover.tsx` consumes the real `useCreateOrderFulfillment`
// mutation hook. It's mocked here the same way `useOrders` is mocked in
// `ready-to-ship-table.spec.tsx`: to control success/failure deterministically
// and to keep module evaluation free of `lib/client`'s build-time defines.
vi.mock("../../../../../../hooks/api/orders", () => ({
  useCreateOrderFulfillment: () => ({
    mutateAsync,
    isPending: false,
  }),
}))

import { FulfillConfirmPopover } from "./fulfill-confirm-popover"

const baseOrder = {
  id: "order_1",
  shipping_methods: [
    {
      id: "sm_1",
      shipping_option_id: "so_1",
      shipping_option: {
        service_zone: {
          fulfillment_set: {
            location: { id: "loc_1", name: "Warehouse A" },
          },
        },
      },
    },
  ],
  items: [
    {
      id: "item_1",
      title: "T-Shirt",
      quantity: 2,
      detail: { fulfilled_quantity: 0 },
    },
    {
      id: "item_2",
      title: "Already fulfilled item",
      quantity: 1,
      detail: { fulfilled_quantity: 1 },
    },
  ],
} as any

afterEach(() => {
  cleanup()
  mutateAsync.mockReset()
})

describe("FulfillConfirmPopover", () => {
  it("renders the inert, disabled Fulfill button when the order has no shipping method - no popover is wired", () => {
    render(
      <TooltipProvider>
        <FulfillConfirmPopover order={{ ...baseOrder, shipping_methods: [] }} />
      </TooltipProvider>
    )

    const button = screen.getByRole("button", {
      name: "orders.readyToShip.fulfill",
    }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it("opens a read-only confirmation showing the default location and only the remaining-quantity items", async () => {
    const user = userEvent.setup()
    render(<FulfillConfirmPopover order={baseOrder} />)

    await user.click(
      screen.getByRole("button", { name: "orders.readyToShip.fulfill" })
    )

    expect(await screen.findByText("Warehouse A")).toBeTruthy()
    expect(screen.getByText("2x T-Shirt")).toBeTruthy()
    expect(screen.queryByText(/Already fulfilled item/)).toBeNull()

    // read-only: no inputs to edit location or quantities, just Confirm/Cancel
    expect(screen.queryAllByRole("textbox").length).toBe(0)
    expect(screen.queryAllByRole("spinbutton").length).toBe(0)
  })

  it("confirms with the unmodified defaults and closes the popover on success", async () => {
    mutateAsync.mockResolvedValueOnce({})
    const user = userEvent.setup()
    render(<FulfillConfirmPopover order={baseOrder} />)

    await user.click(
      screen.getByRole("button", { name: "orders.readyToShip.fulfill" })
    )
    expect(await screen.findByText("Warehouse A")).toBeTruthy()

    await user.click(screen.getByRole("button", { name: "actions.confirm" }))

    expect(mutateAsync).toHaveBeenCalledWith({
      location_id: "loc_1",
      shipping_option_id: "so_1",
      items: [{ id: "item_1", quantity: 2 }],
    })

    await waitFor(() => {
      expect(screen.queryByText("orders.readyToShip.confirmHeading")).toBeNull()
    })
  })

  it("keeps the popover open and surfaces the thrown workflow error inline, not as a toast, on failure", async () => {
    mutateAsync.mockRejectedValueOnce(
      new Error("Unable to buy a shipping label: incomplete address")
    )
    const user = userEvent.setup()
    render(<FulfillConfirmPopover order={baseOrder} />)

    await user.click(
      screen.getByRole("button", { name: "orders.readyToShip.fulfill" })
    )
    await user.click(screen.getByRole("button", { name: "actions.confirm" }))

    expect(
      await screen.findByText(
        "Unable to buy a shipping label: incomplete address"
      )
    ).toBeTruthy()
    expect(screen.getByText("orders.readyToShip.confirmHeading")).toBeTruthy()
  })
})
