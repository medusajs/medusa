import { RegionCountryDTO } from "@medusajs/types"
import { json } from "react-router-dom"
import { StaticCountry } from "../../../../lib/countries"

const acceptedOrderKeys = ["name", "code"]

/**
 * Since countries cannot be retrieved from the API, we need to create a hook
 * that can be used to filter and sort the static list of countries.
 */
export const useCountries = ({
  countries,
  q,
  order = "name",
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

    if (!acceptedOrderKeys.includes(key)) {
      console.log("The key ${key} is not a valid order key")
      throw json(`The key ${key} is not a valid order key`, 500)
    }

    const sortKey: keyof RegionCountryDTO = key === "code" ? "iso_2" : "name"

    data.sort((a, b) => {
      if (a[sortKey] === null && b[sortKey] === null) {
        return 0
      }
      if (a[sortKey] === null) {
        return direction
      }
      if (b[sortKey] === null) {
        return -direction
      }
      return a[sortKey]! > b[sortKey]! ? direction : -direction
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
