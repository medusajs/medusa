import PaymentModuleService from "../payment-module"
import { MathBN } from "@medusajs/framework/utils"

const callRounding = (amount: any, currency: string) => {
  return (PaymentModuleService.prototype as any).roundToCurrencyPrecision.call(
    {},
    amount,
    currency
  )
}

describe("roundToCurrencyPrecision", () => {
  it("should round JPY to 0 decimals", () => {
    const result = callRounding("10.999", "JPY")

    expect(result.toString()).toBe(MathBN.convert("10.999", 0).toString())
  })

  it("should round EUR to 2 decimals", () => {
    const result = callRounding("10.111", "EUR")

    expect(result.toString()).toBe(MathBN.convert("10.111", 2).toString())
  })

  it("should read fraction digits without splitting text (de-DE safe)", () => {
    expect(
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "JPY",
      }).resolvedOptions().maximumFractionDigits
    ).toBe(0)

    expect(
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).resolvedOptions().maximumFractionDigits
    ).toBe(2)
  })
})
