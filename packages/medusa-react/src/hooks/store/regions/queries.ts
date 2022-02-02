import { queryKeysFactory } from "../../utils/index"
import { UseQueryOptionsWrapper } from "../../../types"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { StoreRegionsRes, StoreRegionsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"

const REGIONS_QUERY_KEY = `regions` as const

const regionsKey = queryKeysFactory(REGIONS_QUERY_KEY)

type RegionQueryType = typeof regionsKey

export const useRegions = (
  options?: UseQueryOptionsWrapper<
    Response<StoreRegionsListRes>,
    Error,
    ReturnType<RegionQueryType["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    regionsKey.lists(),
    () => client.regions.list(),
    options
  )
  return { ...data, ...rest } as const
}

export const useRegion = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreRegionsRes>,
    Error,
    ReturnType<RegionQueryType["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    regionsKey.detail(id),
    () => client.regions.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
