import { RegionDTO } from "@medusajs/types"
import { adminRegionKeys, useAdminCustomQuery } from "medusa-react"
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
