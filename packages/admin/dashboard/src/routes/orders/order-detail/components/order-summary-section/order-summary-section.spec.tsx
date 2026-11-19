import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { HttpTypes } from "@medusajs/types"

import { OrderSummarySection } from "./order-summary-section"

const mocks = vi.hoisted(() => ({
  requestedReturns: [] as unknown[],
  reservations: [] as unknown[],
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("../../../../../hooks/use-resource-permissions", () => {
  const allowed = () => ({ canCreate: true, canUpdate: true })
  return {
    useOrderChangePermissions: allowed,
    useOrderClaimPermissions: allowed,
    useOrderExchangePermissions: allowed,
    useOrderPermissions: allowed,
    usePaymentCollectionPermissions: allowed,
    useRefundPermissions: allowed,
    useReservationItemPermissions: allowed,
    useReturnPermissions: allowed,
  }
})

vi.mock("../../../../../components/common/action-menu", () => ({
  ActionMenu: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
}))

vi.mock("../copy-payment-link/copy-payment-link", () => ({
  CopyPaymentLink: () => null,
}))

vi.mock("../../../../../hooks/api/claims", () => ({
  useClaims: () => ({ claims: [] }),
}))

vi.mock("../../../../../hooks/api/exchanges", () => ({
  useExchanges: () => ({ exchanges: [] }),
}))

vi.mock("../../../../../hooks/api/orders", () => ({
  useOrderPreview: () => ({ order: undefined }),
}))

vi.mock("../../../../../hooks/api/payment-collections", () => ({
  useMarkPaymentCollectionAsPaid: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock("../../../../../hooks/api/reservations", () => ({
  useReservationItems: () => ({ reservations: mocks.reservations }),
}))

vi.mock("../../../../../hooks/api/returns", () => ({
  useReturns: ({ status }: { status?: string }) => ({
    returns: status === "requested" ? mocks.requestedReturns : [],
  }),
}))

vi.mock("../../../../../hooks/use-date", () => ({
  useDate: () => ({ getRelativeDate: () => "" }),
}))

const buildOrder = (
  overrides: Partial<HttpTypes.AdminOrder> = {}
): HttpTypes.AdminOrder =>
  ({
    id: "order_1",
    status: "pending",
    currency_code: "usd",
    items: [],
    shipping_methods: [],
    payment_collections: [],
    credit_lines: [],
    summary: { pending_difference: 0 },
    item_subtotal: 0,
    shipping_subtotal: 0,
    original_tax_total: 0,
    original_total: 0,
    discount_total: 0,
    total: 0,
    ...overrides,
  }) as unknown as HttpTypes.AdminOrder

const renderSection = (order: HttpTypes.AdminOrder) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <OrderSummarySection order={order} plugins={[]} />
    </MemoryRouter>
  )

describe("OrderSummarySection footer", () => {
  beforeEach(() => {
    mocks.requestedReturns = []
    mocks.reservations = []
  })

  it("should render the receive return button when a return is requested", () => {
    mocks.requestedReturns = [{ id: "ret_1", canceled_at: null }]

    const html = renderSection(buildOrder())

    expect(html).toContain("orders.returns.receive.action")
  })

  it("should render the allocate items button when an item has no reservation", () => {
    const html = renderSection(
      buildOrder({
        items: [
          {
            id: "item_1",
            title: "Item",
            quantity: 1,
            unit_price: 10,
            subtotal: 10,
            variant: { manage_inventory: true, options: [] },
            detail: {
              fulfilled_quantity: 0,
              shipped_quantity: 0,
              return_requested_quantity: 0,
              return_received_quantity: 0,
              return_dismissed_quantity: 0,
              written_off_quantity: 0,
            },
          },
        ] as unknown as HttpTypes.AdminOrder["items"],
      })
    )

    expect(html).toContain("orders.allocateItems.action")
  })

  it("should render the mark as paid button when a payment collection is not paid", () => {
    const html = renderSection(
      buildOrder({
        payment_collections: [
          {
            id: "paycol_1",
            status: "not_paid",
            amount: 100,
            captured_amount: 0,
            refunded_amount: 0,
          },
        ] as unknown as HttpTypes.AdminOrder["payment_collections"],
        summary: {
          pending_difference: 100,
        } as unknown as HttpTypes.AdminOrder["summary"],
      })
    )

    expect(html).toContain("orders.payment.markAsPaid")
  })

  it("should render the refund button when the order has a negative pending difference", () => {
    const html = renderSection(
      buildOrder({
        summary: {
          pending_difference: -100,
        } as unknown as HttpTypes.AdminOrder["summary"],
      })
    )

    expect(html).toContain("orders.payment.refundAmount")
  })
})
