import { normalizeCurrencyCode } from "../normalize-currency-code"

describe("normalizeCurrencyCode", () => {
  it("returns lowercased currency code", () => {
    const uppercased = "USD"
    const result = normalizeCurrencyCode(uppercased)

    expect(result).toEqual("usd")
  })

  it("throws when value is not a string", () => {
    const errorMessage = "Currency code needs to be a string"

    expect(() => {
      normalizeCurrencyCode(1 as unknown as string)
    }).toThrow(errorMessage)
    expect(() => {
      normalizeCurrencyCode(undefined as unknown as string)
    }).toThrow(errorMessage)
  })
})
