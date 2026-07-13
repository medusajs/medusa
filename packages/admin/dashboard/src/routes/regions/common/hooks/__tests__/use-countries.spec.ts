import { describe, expect, it } from "vitest"

import type { StaticCountry } from "../../../../../lib/data/countries"
import { useCountries } from "../use-countries"

const countries: StaticCountry[] = [
  {
    iso_2: "zw",
    iso_3: "zwe",
    num_code: "716",
    name: "ZIMBABWE",
    display_name: "Zimbabwe",
  },
  {
    iso_2: "af",
    iso_3: "afg",
    num_code: "4",
    name: "AFGHANISTAN",
    display_name: "Afghanistan",
  },
]

describe("useCountries", () => {
  it("sorts by the country table accessor keys", () => {
    const byName = useCountries({
      countries,
      limit: countries.length,
      order: "display_name",
    })
    const byCodeDescending = useCountries({
      countries,
      limit: countries.length,
      order: "-iso_2",
    })

    expect(byName.countries.map((country) => country.iso_2)).toEqual([
      "af",
      "zw",
    ])
    expect(byCodeDescending.countries.map((country) => country.iso_2)).toEqual([
      "zw",
      "af",
    ])
  })
})
