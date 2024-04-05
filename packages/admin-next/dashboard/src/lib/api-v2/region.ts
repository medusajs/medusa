import { CreateRegionDTO, RegionDTO, UpdateRegionDTO } from "@medusajs/types"
import {
  adminRegionKeys,
  useAdminCustomDelete,
  useAdminCustomPost,
  useAdminCustomQuery,
} from "medusa-react"

import { V2ListRes } from "./types/common"

export const useV2Regions = (query?: any, options?: any) => {
  const { data, ...rest } = useAdminCustomQuery(
    "/regions",
    adminRegionKeys.list(query),
    query,
    options
  )

  const typedData: {
    regions: RegionDTO[] | undefined
  } & V2ListRes = {
    regions: data?.regions,
    count: data?.count,
    offset: data?.offset,
    limit: data?.limit,
  }

  return { ...typedData, ...rest }
}

export const useV2Region = (id: string, query?: any, options?: any) => {
  const { data, ...rest } = useAdminCustomQuery(
    `/regions/${id}?fields=*payment_providers`,
    adminRegionKeys.detail(id),
    undefined,
    options
  )

  const region: RegionDTO | undefined = data?.region

  return { region, ...rest }
}

export const useV2CreateRegion = () => {
  return useAdminCustomPost<CreateRegionDTO, { region: RegionDTO }>(
    `/regions`,
    adminRegionKeys.list()
  )
}

export const useV2UpdateRegion = (id: string) => {
  return useAdminCustomPost<UpdateRegionDTO, { region: RegionDTO }>(
    `/regions/${id}`,
    adminRegionKeys.detail(id)
  )
}

export const useV2DeleteRegion = (id: string) => {
  return useAdminCustomDelete(`/regions/${id}`, adminRegionKeys.list())
}
