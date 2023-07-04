import {
  AdminGetRegionsParams,
  AdminGetRegionsRegionFulfillmentOptionsRes,
  AdminRegionsListRes,
  AdminRegionsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_REGIONS_QUERY_KEY = `admin_regions` as const

export const adminRegionKeys = queryKeysFactory(ADMIN_REGIONS_QUERY_KEY)

type RegionQueryKeys = typeof adminRegionKeys

export const useAdminRegions = (
  query?: AdminGetRegionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminRegionsListRes>,
    Error,
    ReturnType<RegionQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminRegionKeys.list(query),
    () => client.admin.regions.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminRegion = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminRegionsRes>,
    Error,
    ReturnType<RegionQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminRegionKeys.detail(id),
    () => client.admin.regions.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminRegionFulfillmentOptions = (
  regionId: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminGetRegionsRegionFulfillmentOptionsRes>,
    Error,
    ReturnType<RegionQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminRegionKeys.detail(`${regionId}_fullfillment-options`),
    () => client.admin.regions.retrieveFulfillmentOptions(regionId),
    options
  )
  return { ...data, ...rest } as const
}
