import { Response } from "@medusajs/medusa-js"
import { Store } from "@medusajs/medusa/dist/models"
import { PaginatedResponse } from "@medusajs/medusa/dist/types/common"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const STORE_QUERY_KEY = `store,count` as const

export const storeKeys = queryKeysFactory(STORE_QUERY_KEY)

type StoreQueryKeys = typeof storeKeys

export class AdminGetStoresParameter {
  offset = 0
  limit = 50
  expand?: string
  fields?: string
}

export type AdminStoresListRes = PaginatedResponse & {
  stores: Store[]
  count: number
}

// type OrderQueryKeys = typeof adminOrderKeys

export const useGetStores = (
  query?: AdminGetStoresParameter,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<Store[]>,
    Error,
    ReturnType<StoreQueryKeys["list"]>
  >
) => {
  const path = `/admin/stores`

  const { data, refetch, ...rest } = useQuery(
    storeKeys.list(query),
    () => medusaRequest<Response<Store[]>>("GET", path),
    options
  )
  return { ...data, ...rest, refetch } as const
}
