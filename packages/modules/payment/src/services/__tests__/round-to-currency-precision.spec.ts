import { MathBN } from "@medusajs/framework/utils"
import PaymentModuleService from "../payment-module"

const roundToCurrencyPrecision = (amount: number, currencyCode: string) =>
  MathBN.convert(
    (
      PaymentModuleService.prototype as any
    ).roundToCurrencyPrecision.call(null, amount, currencyCode)
  ).toNumber()

describe("roundToCurrencyPrecision", () => {
  const OriginalNumberFormat = Intl.NumberFormat

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe.each(["en-US", "de-DE", "ja-JP", "ar-EG"])("under %s", (locale) => {
    beforeEach(() => {
      jest
        .spyOn(Intl, "NumberFormat")
        .mockImplementation(
          (_locales, options) => new OriginalNumberFormat(locale, options)
        )
    })

    it.each([
      ["usd", 200.129, 200.13],
      ["eur", 200.129, 200.13],
      ["jpy", 1999.6, 2000],
      ["kwd", 1.23456, 1.235],
    ])("should round %s to its currency precision", (currency, amount, expected) => {
      expect(roundToCurrencyPrecision(amount, currency)).toBe(expected)
    })
  })

  it("should keep the full precision for a malformed currency code", () => {
    expect(roundToCurrencyPrecision(200.12345, "xx")).toBe(200.12345)
  })
})
