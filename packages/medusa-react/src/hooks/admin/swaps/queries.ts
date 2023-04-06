import {
  AdminGetSwapsParams,
  AdminSwapsListRes,
  AdminSwapsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_SWAPS_QUERY_KEY = `admin_swaps` as const

export const adminSwapKeys = queryKeysFactory(ADMIN_SWAPS_QUERY_KEY)

type SwapsQueryKey = typeof adminSwapKeys

export const useAdminSwaps = (
  query?: AdminGetSwapsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminSwapsListRes>,
    Error,
    ReturnType<SwapsQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminSwapKeys.list(query),
    () => client.admin.swaps.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminSwap = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminSwapsRes>,
    Error,
    ReturnType<SwapsQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminSwapKeys.detail(id),
    () => client.admin.swaps.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
