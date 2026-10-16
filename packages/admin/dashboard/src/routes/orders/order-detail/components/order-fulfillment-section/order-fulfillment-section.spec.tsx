// @vitest-environment jsdom
import React from "react"
import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { getLocaleAmount } from "../../../../../lib/money-amount-helpers"
import { ExtendedOrder } from "../../constants"
import { OrderFulfillmentSection } from "./order-fulfillment-section"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn(),
}))

vi.mock("@medusajs/icons", () => ({
  Buildings: () => <svg />,
  XCircle: () => <svg />,
}))

vi.mock("@medusajs/ui", () => {
  const Passthrough = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  )

  return {
    Button: Passthrough,
    Container: Passthrough,
    Copy: () => null,
    Heading: Passthrough,
    Label: Passthrough,
    Prompt: Passthrough,
    StatusBadge: Passthrough,
    Switch: () => null,
    Text: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
    Tooltip: Passthrough,
    toast: {},
    usePrompt: () => vi.fn(),
  }
})

vi.mock("../../../../../components/common/action-menu", () => ({
  ActionMenu: () => null,
}))

vi.mock("../../../../../components/common/thumbnail", () => ({
  Thumbnail: () => null,
}))

vi.mock("../../../../../hooks/api/orders", () => ({
  useCancelOrderFulfillment: () => ({ mutateAsync: vi.fn() }),
  useMarkOrderFulfillmentAsDelivered: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock("../../../../../hooks/api/stock-locations", () => ({
  useStockLocation: () => ({}),
}))

const buildOrder = (item: {
  quantity: number
  fulfilled_quantity: number
  unit_price: number
  subtotal: number
}) =>
  ({
    id: "order_1",
    status: "pending",
    currency_code: "usd",
    fulfillments: [],
    items: [
      {
        id: "item_1",
        title: "Poncho",
        requires_shipping: true,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        detail: { fulfilled_quantity: item.fulfilled_quantity },
      },
    ],
  } as unknown as ExtendedOrder)

const getRowTexts = () =>
  within(screen.getByText("Poncho").closest(".grid") as HTMLElement)
    .getAllByText(/.+/)
    .map((el) => el.textContent)

describe("OrderFulfillmentSection", () => {
  afterEach(() => {
    cleanup()
  })

  it("pairs a partially fulfilled item's remaining quantity with the total for that quantity", () => {
    render(
      <OrderFulfillmentSection
        order={buildOrder({
          quantity: 2,
          fulfilled_quantity: 1,
          unit_price: 449,
          subtotal: 898,
        })}
      />
    )

    const texts = getRowTexts()

    expect(texts).toContain("1x")
    expect(texts).toContain(getLocaleAmount(449, "usd"))
    expect(texts).not.toContain(getLocaleAmount(898, "usd"))
  })

  it("shows the whole line total while nothing has been fulfilled", () => {
    render(
      <OrderFulfillmentSection
        order={buildOrder({
          quantity: 3,
          fulfilled_quantity: 0,
          unit_price: 10,
          subtotal: 30,
        })}
      />
    )

    const texts = getRowTexts()

    expect(texts).toContain("3x")
    expect(texts).toContain(getLocaleAmount(30, "usd"))
  })
})
