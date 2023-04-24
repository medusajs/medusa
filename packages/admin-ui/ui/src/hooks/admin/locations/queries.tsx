import { Location } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import queryClient from "../../../services/queryClient"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const LOCATION_QUERY_KEY = `location,count` as const

export const locationKeys = queryKeysFactory(LOCATION_QUERY_KEY)

type LocationQueryKeys = typeof locationKeys

export const clearVendorsCache = () => queryClient.clear()

export const useGetLocations = (
  vendorId: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ locations: Location[] }>,
    Error,
    ReturnType<LocationQueryKeys["list"]>
  >
) => {
  const path = `/admin/vendors/${vendorId}/locations`

  const { data, refetch, ...rest } = useQuery(
    locationKeys.list(["/admin/vendors/locations", vendorId]),
    () => medusaRequest<Response<{ locations: Location[] }>>("GET", path),
    options
  )

  return { locations: data?.data?.locations, ...rest, refetch }
}
