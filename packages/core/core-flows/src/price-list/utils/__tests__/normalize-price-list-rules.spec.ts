import { normalizePriceListRules } from "../normalize-price-list-rules"

describe("normalizePriceListRules", () => {
  it("should rewrite the legacy customer group attribute", () => {
    expect(
      normalizePriceListRules({
        rules: { customer_group_id: ["cusgroup_1", "cusgroup_2"] },
      })
    ).toEqual({ rules: { "customer.groups.id": ["cusgroup_1", "cusgroup_2"] } })
  })

  it("should keep the rest of the price list data", () => {
    expect(
      normalizePriceListRules({
        id: "plist_1",
        title: "Wholesale",
        rules: { customer_group_id: ["cusgroup_1"] },
      })
    ).toEqual({
      id: "plist_1",
      title: "Wholesale",
      rules: { "customer.groups.id": ["cusgroup_1"] },
    })
  })

  it("should leave unknown attributes untouched", () => {
    expect(
      normalizePriceListRules({
        rules: { region_id: ["reg_1"], "customer.groups.id": ["cusgroup_1"] },
      })
    ).toEqual({
      rules: { region_id: ["reg_1"], "customer.groups.id": ["cusgroup_1"] },
    })
  })

  it("should prefer the current attribute when both are given", () => {
    expect(
      normalizePriceListRules({
        rules: {
          customer_group_id: ["cusgroup_1"],
          "customer.groups.id": ["cusgroup_2"],
        },
      })
    ).toEqual({ rules: { "customer.groups.id": ["cusgroup_2"] } })
  })

  it("should return price list data without rules as is", () => {
    const priceListData: { id: string; rules?: Record<string, string[]> } = {
      id: "plist_1",
    }

    expect(normalizePriceListRules(priceListData)).toBe(priceListData)
  })
})
