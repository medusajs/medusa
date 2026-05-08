import { adminPriceListRemoteQueryFields } from "../query-config"

describe("adminPriceListRemoteQueryFields", () => {
  it("includes price fields needed to map variant_id", () => {
    expect(adminPriceListRemoteQueryFields).toEqual(
      expect.arrayContaining([
        "prices.id",
        "prices.price_set.variant.id",
        "prices.price_rules.value",
        "prices.price_rules.attribute",
      ])
    )
  })
})
