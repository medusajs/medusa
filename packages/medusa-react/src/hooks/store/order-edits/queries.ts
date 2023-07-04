import { StoreOrderEditsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ORDER_EDITS_QUERY_KEY = `orderEdit` as const

export const orderEditQueryKeys = queryKeysFactory<
  typeof ORDER_EDITS_QUERY_KEY
>(ORDER_EDITS_QUERY_KEY)

type OrderQueryKey = typeof orderEditQueryKeys

export const useOrderEdit = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreOrderEditsRes>,
    Error,
    ReturnType<OrderQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    orderEditQueryKeys.detail(id),
    () => client.orderEdits.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}
