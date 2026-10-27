import { CloudHint } from "../../../types"
import { getHintForPath, HINT_COOLDOWN_MS } from "../hints"

const now = Date.parse("2026-10-26T00:00:00.000Z")

const hints: CloudHint[] = [
  {
    id: "anno_orders",
    title: "Ask AI about your orders",
    description: null,
    link_url: null,
    admin_path: "/orders",
  },
  {
    id: "anno_products",
    title: "Ask AI about your products",
    description: null,
    link_url: null,
    admin_path: "/products/",
  },
]

const noHistory = { shownIds: [], lastToastAt: null, now }

describe("getHintForPath", () => {
  it("should return the hint matching the page, ignoring trailing slashes", () => {
    expect(getHintForPath("/orders/", hints, noHistory)?.id).toEqual(
      "anno_orders"
    )
    expect(getHintForPath("/products", hints, noHistory)?.id).toEqual(
      "anno_products"
    )
  })

  it("should not return a hint on pages without one", () => {
    expect(
      getHintForPath("/orders/order_123", hints, noHistory)
    ).toBeUndefined()
    expect(getHintForPath("/settings", hints, noHistory)).toBeUndefined()
  })

  it("should not return a hint that was already shown", () => {
    expect(
      getHintForPath("/orders", hints, {
        ...noHistory,
        shownIds: ["anno_orders"],
      })
    ).toBeUndefined()
  })

  it("should not return a hint within the cooldown of the last toast", () => {
    expect(
      getHintForPath("/orders", hints, {
        ...noHistory,
        lastToastAt: now - HINT_COOLDOWN_MS + 1,
      })
    ).toBeUndefined()
    expect(
      getHintForPath("/orders", hints, {
        ...noHistory,
        lastToastAt: now - HINT_COOLDOWN_MS,
      })?.id
    ).toEqual("anno_orders")
  })
})
