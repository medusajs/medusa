import PaymentModuleService from "../payment-module"

const callRounding = (amount: any, currency: string) => {
  return (PaymentModuleService.prototype as any).roundToCurrencyPrecision.call(
    {},
    amount,
    currency
  )
}

describe("roundToCurrencyPrecision validation", () => {
  it("should throw INVALID_DATA when amount is null or undefined", () => {
    expect(() => callRounding(null, "USD")).toThrow("Amount must be defined.")
    expect(() => callRounding(undefined, "USD")).toThrow(
      "Amount must be defined."
    )
  })

  it("should throw INVALID_DATA when amount is not finite", () => {
    expect(() => callRounding("NaN", "USD")).toThrow(
      "Amount must be a finite number."
    )
    expect(() => callRounding(NaN, "USD")).toThrow(
      "Amount must be a finite number."
    )
    expect(() => callRounding(Infinity, "USD")).toThrow(
      "Amount must be a finite number."
    )
  })

  it("should throw INVALID_DATA when amount is negative", () => {
    expect(() => callRounding("-5.00", "USD")).toThrow(
      "Amount must be greater than or equal to 0."
    )
  })

  it("should allow zero through validation", () => {
    expect(() => callRounding("0", "USD")).not.toThrow()
  })
})
