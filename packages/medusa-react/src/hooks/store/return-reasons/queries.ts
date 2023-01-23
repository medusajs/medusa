import {
  StoreReturnReasonsListRes,
  StoreReturnReasonsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const RETURNS_REASONS_QUERY_KEY = `return_reasons` as const

const returnReasonsKey = queryKeysFactory(RETURNS_REASONS_QUERY_KEY)

type ReturnReasonsQueryKey = typeof returnReasonsKey

export const useReturnReasons = (
  options?: UseQueryOptionsWrapper<
    Response<StoreReturnReasonsListRes>,
    Error,
    ReturnType<ReturnReasonsQueryKey["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    returnReasonsKey.lists(),
    () => client.returnReasons.list(),
    options
  )
  return { ...data, ...rest } as const
}

export const useReturnReason = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreReturnReasonsRes>,
    Error,
    ReturnType<ReturnReasonsQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    returnReasonsKey.detail(id),
    () => client.returnReasons.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
