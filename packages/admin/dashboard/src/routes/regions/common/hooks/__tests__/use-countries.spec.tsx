import { describe, expect, it } from "vitest"

import { StaticCountry } from "../../../../../lib/data/countries"
import { useCountries } from "../use-countries"

const buildCountry = (
  overrides: Partial<StaticCountry> = {}
): StaticCountry => ({
  iso_2: "us",
  iso_3: "usa",
  num_code: "840",
  name: "UNITED STATES",
  display_name: "United States",
  ...overrides,
})

const countries: StaticCountry[] = [
  buildCountry({ iso_2: "dk", iso_3: "dnk", name: "DENMARK", display_name: "Denmark" }),
  buildCountry({ iso_2: "us", iso_3: "usa", name: "UNITED STATES", display_name: "United States" }),
  buildCountry({ iso_2: "ca", iso_3: "can", name: "CANADA", display_name: "Canada" }),
]

describe("useCountries", () => {
  it("sorts by name ascending by default", () => {
    const { countries: result } = useCountries({
      countries: [...countries],
      limit: 10,
    })

    expect(result.map((c) => c.iso_2)).toEqual(["ca", "dk", "us"])
  })

  it("sorts by name descending when order is prefixed with -", () => {
    const { countries: result } = useCountries({
      countries: [...countries],
      limit: 10,
      order: "-name",
    })

    expect(result.map((c) => c.iso_2)).toEqual(["us", "dk", "ca"])
  })

  it("sorts by iso_2 ascending", () => {
    const { countries: result } = useCountries({
      countries: [...countries],
      limit: 10,
      order: "iso_2",
    })

    expect(result.map((c) => c.iso_2)).toEqual(["ca", "dk", "us"])
  })

  it("sorts by iso_2 descending when order is prefixed with -", () => {
    const { countries: result } = useCountries({
      countries: [...countries],
      limit: 10,
      order: "-iso_2",
    })

    expect(result.map((c) => c.iso_2)).toEqual(["us", "dk", "ca"])
  })

  it("throws when the order key is not accepted", () => {
    expect(() =>
      useCountries({
        countries: [...countries],
        limit: 10,
        order: "should_throw",
      })
    ).toThrow()
  })

  it("filters by q, matching on name or iso_2, ignoring order and pagination", () => {
    const { countries: result, count } = useCountries({
      countries: [...countries],
      limit: 10,
      q: "ca",
    })

    expect(result.map((c) => c.iso_2)).toEqual(["ca"])
    expect(count).toBe(1)
  })

  it("respects limit and offset when no query is provided", () => {
    const { countries: result, count } = useCountries({
      countries: [...countries],
      limit: 1,
      offset: 1,
    })

    expect(result).toHaveLength(1)
    expect(count).toBe(countries.length)
  })
})
