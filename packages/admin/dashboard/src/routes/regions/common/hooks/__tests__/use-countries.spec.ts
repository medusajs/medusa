import { describe, expect, it } from "vitest"

import type { StaticCountry } from "../../../../../lib/data/countries"
import { useCountries } from "../use-countries"

describe("useCountries", () => {
  it("filters by query without throwing when name or iso_2 is missing (API-shaped rows)", () => {
    const countries = [
      {
        iso_2: "xx",
        iso_3: "xxx",
        num_code: "999",
        display_name: "Testland",
        // intentional: some API payloads can omit `name`
        name: undefined,
      },
      {
        iso_2: "yy",
        iso_3: "yyy",
        num_code: "998",
        display_name: "Other",
        name: "OTHER",
      },
    ] as unknown as StaticCountry[]

    expect(() =>
      useCountries({
        countries,
        q: "xx",
        limit: 10,
      })
    ).not.toThrow()

    const { countries: filtered, count } = useCountries({
      countries,
      q: "xx",
      limit: 10,
    })

    expect(count).toBe(1)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].iso_2).toBe("xx")
  })

  it("matches iso_2 case-insensitively when name is present", () => {
    const countries = [
      {
        iso_2: "us",
        iso_3: "usa",
        num_code: "840",
        name: "UNITED STATES",
        display_name: "United States",
      },
    ] as unknown as StaticCountry[]

    const { count } = useCountries({
      countries,
      q: "US",
      limit: 10,
    })

    expect(count).toBe(1)
  })
})
