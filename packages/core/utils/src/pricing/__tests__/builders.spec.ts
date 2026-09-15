import { buildPriceListRules } from "../builders"

describe("buildPriceListRules", () => {
  it("returns a bare array for in rules", () => {
    const result = buildPriceListRules([
      {
        id: "prule_1",
        attribute: "customer.groups.id",
        value: ["cg-1"],
        operator: "in",
      } as any,
    ])

    expect(result).toEqual({ "customer.groups.id": ["cg-1"] })
  })

  it("returns an object with operator for nin rules", () => {
    const result = buildPriceListRules([
      {
        id: "prule_2",
        attribute: "customer.groups.id",
        value: ["cg-1"],
        operator: "nin",
      } as any,
    ])

    expect(result).toEqual({
      "customer.groups.id": { operator: "nin", value: ["cg-1"] },
    })
  })
})
