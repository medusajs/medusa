import { HttpTypes } from "@zjedene-medusa/types"
import { UIMatch } from "react-router-dom"

import { useStockLocation } from "../../../hooks/api/stock-locations"
import { LOCATION_DETAILS_FIELD } from "./constants"

type LocationDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminStockLocationResponse>

export const LocationDetailBreadcrumb = (
  props: LocationDetailBreadcrumbProps
) => {
  const { location_id } = props.params || {}

  const { stock_location } = useStockLocation(
    location_id!,
    {
      fields: LOCATION_DETAILS_FIELD,
    },
    {
      initialData: props.data,
      enabled: Boolean(location_id),
    }
  )

  if (!stock_location) {
    return null
  }

  return <span>{stock_location.name}</span>
}
