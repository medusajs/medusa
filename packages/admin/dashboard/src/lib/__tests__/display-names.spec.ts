import { describe, expect, it } from "vitest"

import {
  getCountryDisplayName,
  getCountryDisplayNameFromStatic,
  getCurrencyDisplayName,
} from "../display-names"

describe("getCountryDisplayName", () => {
  it("returns the localized country name for a known locale", () => {
    expect(getCountryDisplayName("dk", "da")).toBe("Danmark")
    expect(getCountryDisplayName("de", "ja")).toBe("ドイツ")
    expect(getCountryDisplayName("DE", "es")).toBe("Alemania")
  })

  it("accepts both lowercase and uppercase ISO codes", () => {
    expect(getCountryDisplayName("dk", "da")).toBe(
      getCountryDisplayName("DK", "da")
    )
  })

  it("returns undefined for empty inputs", () => {
    expect(getCountryDisplayName("", "da")).toBeUndefined()
    expect(getCountryDisplayName(null, "da")).toBeUndefined()
    expect(getCountryDisplayName("dk", null)).toBeUndefined()
    expect(getCountryDisplayName(undefined, "da")).toBeUndefined()
    expect(getCountryDisplayName("dk", undefined)).toBeUndefined()
  })

  it("falls back to the input code when CLDR has no entry for a code", () => {
    // `XV` is a user-assigned ISO code. `Intl.DisplayNames.of("XV")`
    // returns the input code in every Node version we ship against, so
    // the helper treats that as "no localized data" and returns
    // undefined. Callers then fall back to the English display_name.
    expect(getCountryDisplayName("XV", "da")).toBeUndefined()
  })

  it("normalizes the locale key shape the i18n provider hands back", () => {
    // The dashboard stores language codes as `enGB`, `ptBR`, `zhCN` (the
    // i18n-key shape) - the i18n provider exposes `formatLocaleCode` to
    // turn those into BCP-47 (`en-GB`, `pt-BR`, `zh-CN`). The helper
    // expects the already-BCP-47 form.
    expect(getCountryDisplayName("GB", "en-GB")).toBe("United Kingdom")
    expect(getCountryDisplayName("JP", "ja")).toBe("日本")
  })
})

describe("getCurrencyDisplayName", () => {
  it("returns the localized currency name for a known locale", () => {
    expect(getCurrencyDisplayName("DKK", "da")).toBe("dansk krone")
    expect(getCurrencyDisplayName("JPY", "pt-BR")).toBe("Iene japonês")
  })

  it("returns undefined for ISO 4217 codes that CLDR does not know", () => {
    // `IRT` is the Iranian Toman (a non-ISO code); CLDR has no entry.
    // `Intl.DisplayNames.of("IRT")` returns the input code in every
    // Node version we ship against, so the helper returns undefined
    // and the caller's English fallback (e.g. `currency.name`) runs.
    expect(getCurrencyDisplayName("IRT", "da")).toBeUndefined()
  })

  it("returns undefined for empty inputs", () => {
    expect(getCurrencyDisplayName("", "da")).toBeUndefined()
    expect(getCurrencyDisplayName("USD", "")).toBeUndefined()
    expect(getCurrencyDisplayName(null, "da")).toBeUndefined()
  })
})

describe("getCountryDisplayNameFromStatic", () => {
  it("returns the localized name when Intl has data", () => {
    expect(
      getCountryDisplayNameFromStatic(
        { iso_2: "dk", display_name: "Denmark" },
        "da"
      )
    ).toBe("Danmark")
  })

  it("falls back to the static English display_name when Intl has no data", () => {
    expect(
      getCountryDisplayNameFromStatic(
        { iso_2: "xv", display_name: "User-assigned" },
        "da"
      )
    ).toBe("User-assigned")
  })

  it("returns undefined when the country is missing", () => {
    expect(getCountryDisplayNameFromStatic(null, "da")).toBeUndefined()
    expect(getCountryDisplayNameFromStatic(undefined, "da")).toBeUndefined()
  })
})
