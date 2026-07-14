import { json } from "react-router-dom"
import { StaticCountry } from "../../../../lib/data/countries"

const acceptedOrderKeys = ["display_name", "iso_2"] as const

type CountryOrderKey = (typeof acceptedOrderKeys)[number]

const isCountryOrderKey = (key: string): key is CountryOrderKey =>
  acceptedOrderKeys.includes(key as CountryOrderKey)

/**
 * Since countries cannot be retrieved from the API, we need to create a hook
 * that can be used to filter and sort the static list of countries.
 */
export const useCountries = ({
  countries,
  q,
  order = "display_name",
  limit,
  offset = 0,
}: {
  countries: StaticCountry[]
  limit: number
  offset?: number
  order?: string
  q?: string
}) => {
  const data = countries.slice(offset, offset + limit)

  if (order) {
    const direction = order.startsWith("-") ? -1 : 1
    const key = order.replace("-", "")

    if (!isCountryOrderKey(key)) {
      throw json(`The key ${key} is not a valid order key`, 500)
    }

    data.sort((a, b) => {
      if (a[key] === null && b[key] === null) {
        return 0
      }
      if (a[key] === null) {
        return direction
      }
      if (b[key] === null) {
        return -direction
      }
      return a[key]! > b[key]! ? direction : -direction
    })
  }

  if (q) {
    const query = q.toLowerCase()
    const results = countries.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.iso_2.toLowerCase().includes(query)
    )
    return {
      countries: results,
      count: results.length,
    }
  }

  return {
    countries: data,
    count: countries.length,
  }
}
