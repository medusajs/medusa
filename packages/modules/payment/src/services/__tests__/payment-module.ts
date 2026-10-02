import PaymentModuleService from "../payment-module"

const roundToCurrencyPrecision = (amount: unknown, currencyCode = "USD") => {
  return (PaymentModuleService.prototype as any).roundToCurrencyPrecision.call(
    {},
    amount,
    currencyCode
  )
}

describe("PaymentModuleService.roundToCurrencyPrecision", () => {
  it("rounds valid amounts", () => {
    expect(roundToCurrencyPrecision(12.345).toString()).toBe("12.35")
    expect(roundToCurrencyPrecision(0).toString()).toBe("0")
  })

  it.each([
    null,
    undefined,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "not-a-number",
  ])("rejects invalid amount %p", (amount) => {
    expect(() => roundToCurrencyPrecision(amount)).toThrow(
      "Amount must be a finite, non-negative number."
    )
  })
})
