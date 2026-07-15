import { describe, expect, it } from "vitest"
import { useCountries } from "../use-countries"
import { StaticCountry } from "../../../../../lib/data/countries"

const countries: StaticCountry[] = [
  {
    name: "Brazil",
    display_name: "Brazil",
    iso_2: "br",
    num_code: "076",
  },
  {
    name: "Argentina",
    display_name: "Argentina",
    iso_2: "ar",
    num_code: "032",
  },
]

describe("useCountries", () => {
  it("sorts by display_name", () => {
    const result = useCountries({
      countries,
      limit: 10,
      order: "display_name",
    })

    expect(result.countries.map((country) => country.display_name)).toEqual([
      "Argentina",
      "Brazil",
    ])
  })

  it("sorts by iso_2 descending", () => {
    const result = useCountries({
      countries,
      limit: 10,
      order: "-iso_2",
    })

    expect(result.countries.map((country) => country.iso_2)).toEqual([
      "br",
      "ar",
    ])
  })
})
