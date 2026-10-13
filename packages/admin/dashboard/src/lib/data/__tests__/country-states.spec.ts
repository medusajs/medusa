import { describe, expect, it } from "vitest"

import {
  getCountryProvinceObjectByIso2,
  getProvinceByIso2,
  isProvinceInCountry,
} from "../country-states"

describe("country-states: Iran", () => {
  it("exposes 31 provinces typed as province", () => {
    const iran = getCountryProvinceObjectByIso2("ir")

    expect(iran?.type).toBe("province")
    expect(Object.keys(iran?.options ?? {})).toHaveLength(31)
  })

  it("resolves Tehran and Alborz by ISO 3166-2 code", () => {
    expect(getProvinceByIso2("IR-23")).toBe("Tehran")
    expect(getProvinceByIso2("ir-30")).toBe("Alborz")
  })

  it("accepts lowercase codes in isProvinceInCountry", () => {
    expect(isProvinceInCountry("ir", "ir-23")).toBe(true)
    expect(isProvinceInCountry("ir", "ir-99")).toBe(false)
  })
})
