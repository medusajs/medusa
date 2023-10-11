import { getInvalidRuleAttributes } from ".."

describe("getInvalidRuleAttributes", function () {
  it("should return list of rule attributes that matches reserved keywords", function () {
    let result = getInvalidRuleAttributes(["shouldnotmatch"])
    expect(result).toEqual([])

    result = getInvalidRuleAttributes(["currency_code", "shouldnotmatch"])
    expect(result).toEqual(["currency_code"])

    result = getInvalidRuleAttributes(["currency_code", "price_list_id"])
    expect(result).toEqual(["currency_code", "price_list_id"])

    result = getInvalidRuleAttributes(["shouldnotmatch", "quantity"])
    expect(result).toEqual(["quantity"])
  })
})
