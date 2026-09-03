// Test the underlying Intl.DisplayNames behavior that intl.ts relies on.
// This ensures the BCP-47 normalization and fallback logic work correctly.

describe("Intl.DisplayNames for country/currency", () => {
  it("should resolve country names in Japanese", () => {
    const displayNames = new Intl.DisplayNames(["ja"], { type: "region" })
    expect(displayNames.of("DK")).toBe("デンマーク")
  })

  it("should resolve currency names in Japanese", () => {
    const displayNames = new Intl.DisplayNames(["ja"], { type: "currency" })
    expect(displayNames.of("USD")).toBe("米ドル")
  })

  it("should resolve country names with BCP-47 tag (pt-BR)", () => {
    const displayNames = new Intl.DisplayNames(["pt-BR"], { type: "region" })
    expect(displayNames.of("BR")).toBe("Brasil")
  })

  it("should throw RangeError for non-BCP47 locale without dash (ptBR)", () => {
    expect(() => {
      new Intl.DisplayNames(["ptBR"], { type: "region" })
    }).toThrow(RangeError)
  })

  it("should fall back to English for invalid locales", () => {
    let displayNames
    try {
      displayNames = new Intl.DisplayNames(["invalid-locale"], {
        type: "region",
      })
    } catch {
      displayNames = new Intl.DisplayNames(["en"], { type: "region" })
    }
    expect(displayNames.of("DK")).toBe("Denmark")
  })
})
