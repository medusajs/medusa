import {
  getLastFulfillmentStatus,
  getLastPaymentStatus,
} from "../aggregate-status"

describe("Aggregate Order Status", () => {
  it("should return aggregated payment collection status", () => {
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
      })
    ).toEqual("requires_action")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "awaiting" },
          { status: "awaiting" },
          { status: "canceled" },
          { status: "awaiting" },
        ],
      })
    ).toEqual("awaiting")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized" },
          { status: "authorized" },
          { status: "canceled" },
        ],
      })
    ).toEqual("authorized")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "awaiting" },
          { status: "authorized" },
          { status: "canceled" },
        ],
      })
    ).toEqual("partially_authorized")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", refunded_amount: 10, amount: 10 },
          { status: "authorized", refunded_amount: 5, amount: 10 },
          { status: "canceled" },
        ],
      })
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
      })
    ).toEqual("partially_refunded")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", captured_amount: 12, amount: 12 },
          { status: "canceled" },
        ],
      })
    ).toEqual("captured")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", captured_amount: 5, amount: 10 },
        ],
      })
    ).toEqual("partially_captured")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized" },
        ],
      })
    ).toEqual("partially_captured")

    expect(
      getLastPaymentStatus({
        payment_collections: [
          { status: "authorized", captured_amount: 10, amount: 10 },
          { status: "authorized", captured_amount: 12, amount: 12 },
        ],
      })
    ).toEqual("captured")

    expect(
      getLastPaymentStatus({
        payment_collections: [{ status: "canceled" }, { status: "canceled" }],
      })
    ).toEqual("canceled")
  })

  it("should return aggregated fulfillment status", () => {
    const aaa = ["packed_at", "shipped_at", "delivered_at", "canceled_at"]

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ created_at: new Date() }],
      })
    ).toEqual("not_fulfilled")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ created_at: new Date() }, { packed_at: new Date() }],
      })
    ).toEqual("partially_fulfilled")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ packed_at: new Date() }, { packed_at: new Date() }],
      })
    ).toEqual("fulfilled")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ shipped_at: new Date() }, { packed_at: new Date() }],
      })
    ).toEqual("partially_shipped")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ shipped_at: new Date() }, { shipped_at: new Date() }],
      })
    ).toEqual("shipped")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { shipped_at: new Date() },
          { delivered_at: new Date() },
        ],
      })
    ).toEqual("partially_delivered")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { delivered_at: new Date() },
          { delivered_at: new Date() },
        ],
      })
    ).toEqual("delivered")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { delivered_at: new Date() },
          { canceled_at: new Date() },
        ],
      })
    ).toEqual("delivered")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [{ shipped_at: new Date() }, { canceled_at: new Date() }],
      })
    ).toEqual("shipped")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { packed_at: new Date() },
          { shipped_at: new Date() },
          { canceled_at: new Date() },
        ],
      })
    ).toEqual("partially_shipped")

    expect(
      getLastFulfillmentStatus({
        fulfillments: [
          { canceled_at: new Date() },
          { canceled_at: new Date() },
        ],
      })
    ).toEqual("canceled")
  })
})
