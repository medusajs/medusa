import {
  getLastFulfillmentStatus,
  getLastPaymentStatus,
} from "../aggregate-status"

describe("Aggregate Order Status", () => {
  it("should return aggregated payment collection status", () => {
    expect(
      getLastPaymentStatus({
        payment_collections: [],
      } as any)
    ).toEqual("not_paid")

    expect(
      getLastPaymentStatus({
        payment_collections: [{ status: "not_paid" }],
      } as any)
    ).toEqual("not_paid")

    expect(
      getLastPaymentStatus({
        payment_collections: [{ status: "not_paid" }, { status: "awaiting" }],
      } as any)
    ).toEqual("awaiting")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "requires_action" },
          { status: "refunded" },
          { status: "refunded" },
          { status: "captured" },
          { status: "captured" },
          { status: "canceled" },
          { status: "authorized" },
        ],
      } as any)
    ).toEqual("requires_action")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "awaiting" },
          { status: "awaiting" },
          { status: "canceled" },
          { status: "awaiting" },
        ],
      } as any)
    ).toEqual("awaiting")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized" },
          { status: "authorized" },
          { status: "canceled" },
        ],
      } as any)
    ).toEqual("authorized")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "awaiting" },
          { status: "authorized" },
          { status: "canceled" },
        ],
      } as any)
    ).toEqual("partially_authorized")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", refunded_amount: 10, amount: 10 },
          { status: "authorized", refunded_amount: 5, amount: 10 },
          { status: "canceled" },
        ],
      } as any)
    ).toEqual("partially_refunded")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", refunded_amount: 10, amount: 10 },
          { status: "authorized", refunded_amount: 10, amount: 10 },
          { status: "authorized" },
          { status: "canceled" },
        ],
      } as any)
    ).toEqual("partially_refunded")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", captured_amount: 12, amount: 12 },
          { status: "canceled" },
        ],
      } as any)
    ).toEqual("captured")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", captured_amount: 5, amount: 10 },
        ],
      } as any)
    ).toEqual("partially_captured")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized" },
        ],
      } as any)
    ).toEqual("partially_captured")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", captured_amount: 12, amount: 12 },
        ],
      } as any)
    ).toEqual("captured")

    expect(
      getLastPaymentStatus({
        payment_collections: [{ status: "canceled" }, { status: "canceled" }],
      } as any)
    ).toEqual("canceled")
  })

  it("should return aggregated fulfillment status", () => {
    expect(
      getLastFulfillmentStatus({
        fulfillments: [],
      } as any)
    ).toEqual("not_fulfilled")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ created_at: new Date() }],
      } as any)
    ).toEqual("not_fulfilled")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ created_at: new Date() }, { packed_at: new Date() }],
      } as any)
    ).toEqual("partially_fulfilled")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ packed_at: new Date() }, { packed_at: new Date() }],
      } as any)
    ).toEqual("fulfilled")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ shipped_at: new Date() }, { packed_at: new Date() }],
      } as any)
    ).toEqual("partially_shipped")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ shipped_at: new Date() }, { shipped_at: new Date() }],
      } as any)
    ).toEqual("shipped")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { shipped_at: new Date() },
          { delivered_at: new Date() },
        ],
      } as any)
    ).toEqual("partially_delivered")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { delivered_at: new Date() },
          { delivered_at: new Date() },
        ],
      } as any)
    ).toEqual("delivered")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { delivered_at: new Date() },
          { canceled_at: new Date() },
        ],
      } as any)
    ).toEqual("delivered")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ shipped_at: new Date() }, { canceled_at: new Date() }],
      } as any)
    ).toEqual("shipped")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { packed_at: new Date() },
          { shipped_at: new Date() },
          { canceled_at: new Date() },
        ],
      } as any)
    ).toEqual("partially_shipped")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { canceled_at: new Date() },
          { canceled_at: new Date() },
        ],
      } as any)
    ).toEqual("canceled")
  })
})
