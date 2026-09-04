import { describe, expect, it } from "vitest"

import { countries } from "../data/countries"
import { getCountryDisplayName, getCurrencyDisplayName } from "../display-names"

describe("getCountryDisplayName", () => {
  it("translates a country into the given locale", () => {
    expect(getCountryDisplayName("dk", "Denmark", "da")).toBe("Danmark")
    expect(getCountryDisplayName("de", "Germany", "es")).toBe("Alemania")
    expect(getCountryDisplayName("dk", "Denmark", "ja")).toBe("デンマーク")
  })

  it("accepts the lower cased codes the dashboard stores", () => {
    expect(getCountryDisplayName("us", "United States", "de")).toBe(
      getCountryDisplayName("US", "United States", "de")
    )
  })

  it("resolves every packaged country rather than falling back", () => {
    const fellBack = countries.filter(
      (country) =>
        getCountryDisplayName(country.iso_2, "__fallback__", "ja") ===
        "__fallback__"
    )

    expect(fellBack).toEqual([])
    expect(countries).toHaveLength(250)
  })

  it("keeps the packaged name when the locale renders it identically", () => {
    // Danish spells plenty of countries the same way English does; that is a
    // translation, not a failure to find one.
    expect(getCountryDisplayName("gh", "Ghana", "da")).toBe("Ghana")
  })

  it("falls back when the code is missing or unusable", () => {
    expect(getCountryDisplayName(null, "Fallback", "da")).toBe("Fallback")
    expect(getCountryDisplayName(undefined, "Fallback", "da")).toBe("Fallback")
    // QQ is structurally valid but unassigned, so there is no entry for it.
    expect(getCountryDisplayName("qq", "Fallback", "da")).toBe("Fallback")
    expect(getCountryDisplayName("not-a-code", "Fallback", "da")).toBe(
      "Fallback"
    )
  })

  it("keeps separate results per locale for the same code", () => {
    expect(getCountryDisplayName("dk", "Denmark", "ja")).toBe("デンマーク")
    expect(getCountryDisplayName("dk", "Denmark", "da")).toBe("Danmark")
    // read back through the cache
    expect(getCountryDisplayName("dk", "Denmark", "ja")).toBe("デンマーク")
  })
})

describe("getCurrencyDisplayName", () => {
  it("translates a currency into the given locale", () => {
    expect(getCurrencyDisplayName("dkk", "Danish Krone", "da")).toBe(
      "dansk krone"
    )
    expect(getCurrencyDisplayName("JPY", "Japanese Yen", "pt-BR")).toBe(
      "Iene japonês"
    )
  })

  it("falls back for codes outside ISO 4217", () => {
    // IRT is the Iranian Toman, which CLDR has no entry for in any locale.
    expect(getCurrencyDisplayName("IRT", "Iranian Toman", "da")).toBe(
      "Iranian Toman"
    )
    expect(getCurrencyDisplayName("IRT", "Iranian Toman", "en")).toBe(
      "Iranian Toman"
    )
  })

  it("does not answer for a currency out of the region cache, or the reverse", () => {
    // Same locale, same-looking key: the cache has to keep the two types apart.
    expect(getCurrencyDisplayName("dkk", "Danish Krone", "da")).toBe(
      "dansk krone"
    )
    expect(getCountryDisplayName("dk", "Denmark", "da")).toBe("Danmark")
  })
})
