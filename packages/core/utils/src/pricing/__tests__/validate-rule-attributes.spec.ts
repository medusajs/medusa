import { validateRuleAttributes } from ".."

describe("validateRuleAttributes", function () {
  it("should return void if there are no validation errors", function () {
    let result = validateRuleAttributes(["shouldpasswithouterrors"])

    expect(result).toEqual(undefined)
  })

  it("should throw an error if one of the array strings matches a reserved keyword", function () {
    let error

    try {
      validateRuleAttributes([
        "currency_code",
        "shouldnotbepresent",
        "quantity",
        "price_list_id",
      ])
    } catch (e) {
      error = e
    }

    expect(error.message).toEqual(
      "Can't create rule_attribute with reserved keywords [quantity, currency_code, price_list_id] - quantity, currency_code, price_list_id"
    )
  })
})
