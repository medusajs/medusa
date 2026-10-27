// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { TooltipProvider } from "@medusajs/ui"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// `ready-to-ship-table.tsx` imports `useOrders`, which pulls in
// `lib/client` - that module reads build-time defines (`__AUTH_TYPE__`
// etc.) injected by the Vite config and isn't available under a plain
// component test. These cell components don't exercise data fetching, so
// the hook is mocked out purely to keep module evaluation side-effect free.
vi.mock("../../../../../../hooks/api/orders", () => ({
  useOrders: () => ({
    orders: [],
    count: 0,
    isLoading: false,
    isError: false,
    error: undefined,
  }),
}))

import {
  FulfillCell,
  PackageCell,
  ShipFromCell,
  ShippingRateCell,
} from "./ready-to-ship-table"

afterEach(() => {
  cleanup()
})

describe("ReadyToShipTable shipping rate / fulfill", () => {
  it("shows $0.00 for a free shipping method, distinct from no shipping method at all", () => {
    // order A: shipping_methods[0].amount === 0 -> renders "$0.00"
    const { unmount } = render(
      <ShippingRateCell
        shippingMethod={
          {
            id: "sm_1",
            order_id: "order_1",
            name: "Free Shipping",
            amount: 0,
            is_tax_inclusive: false,
            shipping_option_id: "so_1",
            data: null,
          } as any
        }
        currencyCode="usd"
      />
    )

    expect(screen.getByText("Free Shipping")).toBeTruthy()
    expect(screen.getByText(/0\.00/)).toBeTruthy()

    unmount()

    // order B: shipping_methods is empty -> renders empty cell, visibly
    // distinct from the $0.00 case above
    const { container } = render(
      <ShippingRateCell shippingMethod={undefined} currencyCode="usd" />
    )

    expect(container.textContent).toBe("")
    expect(screen.queryByText("Free Shipping")).toBeNull()
    expect(screen.queryByText(/0\.00/)).toBeNull()
  })

  it("enables Fulfill for a free shipping method and disables it with 'No shipping method' when there is none", async () => {
    const user = userEvent.setup()

    const { unmount } = render(
      <TooltipProvider>
        <FulfillCell hasShippingMethod={true} />
      </TooltipProvider>
    )

    const enabledButton = screen.getByRole("button", {
      name: "orders.readyToShip.fulfill",
    }) as HTMLButtonElement
    expect(enabledButton.disabled).toBe(false)

    unmount()

    render(
      <TooltipProvider>
        <FulfillCell hasShippingMethod={false} />
      </TooltipProvider>
    )

    const disabledButton = screen.getByRole("button", {
      name: "orders.readyToShip.fulfill",
    }) as HTMLButtonElement
    expect(disabledButton.disabled).toBe(true)

    await user.hover(disabledButton)

    await waitFor(() => {
      expect(
        screen.getAllByText("orders.readyToShip.noShippingMethod").length
      ).toBeGreaterThan(0)
    })
  })
})

describe("ShipFromCell", () => {
  it("renders the resolved location name", () => {
    render(
      <ShipFromCell
        shippingMethod={
          {
            id: "sm_1",
            order_id: "order_1",
            name: "Standard Shipping",
            amount: 1000,
            is_tax_inclusive: false,
            shipping_option_id: "so_1",
            data: null,
            shipping_option: {
              service_zone: {
                fulfillment_set: {
                  location: { name: "Warehouse A" },
                },
              },
            },
          } as any
        }
      />
    )

    expect(screen.getByText("Warehouse A")).toBeTruthy()
  })

  it("renders empty when there is no shipping method - the same precondition the Shipping Rate column fails under", () => {
    const { container } = render(<ShipFromCell shippingMethod={undefined} />)

    expect(container.textContent).toBe("")
  })
})

describe("PackageCell", () => {
  it("renders 'Not set' for each missing weight/dimension field instead of a fabricated default", () => {
    render(
      <PackageCell
        items={[
          {
            id: "item_1",
            quantity: 2,
            detail: { fulfilled_quantity: 0 },
            variant: {
              weight: null,
              length: null,
              width: null,
              height: null,
            },
          } as any,
        ]}
      />
    )

    expect(
      screen.getByText("orders.readyToShip.weight: orders.readyToShip.notSet")
    ).toBeTruthy()
    expect(
      screen.getByText(
        "orders.readyToShip.notSet x orders.readyToShip.notSet x orders.readyToShip.notSet"
      )
    ).toBeTruthy()
  })

  it("renders the computed parcel when the dimensions are set", () => {
    render(
      <PackageCell
        items={[
          {
            id: "item_1",
            quantity: 2,
            detail: { fulfilled_quantity: 0 },
            variant: {
              weight: 5,
              length: 10,
              width: 20,
              height: 30,
            },
          } as any,
        ]}
      />
    )

    expect(screen.getByText("orders.readyToShip.weight: 10")).toBeTruthy()
    expect(screen.getByText("10 x 20 x 30")).toBeTruthy()
  })
})
