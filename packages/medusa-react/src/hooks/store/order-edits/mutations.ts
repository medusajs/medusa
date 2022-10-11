import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  StoreOrderEditsRes,
  StorePostOrderEditsOrderEditDecline,
} from "@medusajs/medusa"

import { buildOptions } from "../../utils/buildOptions"
import { useMedusa } from "../../../contexts"
import { orderEditQueryKeys } from "."

export const useDeclineOrderEdit = (
  id: string,
  options?: UseMutationOptions<
    Response<StoreOrderEditsRes>,
    Error,
    StorePostOrderEditsOrderEditDecline
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: StorePostOrderEditsOrderEditDecline) =>
      client.orderEdits.decline(id, payload),
    buildOptions(
      queryClient,
      [orderEditQueryKeys.lists(), orderEditQueryKeys.detail(id)],
      options
    )
  )
}

export const useCompleteOrderEdit = (
  id: string,
  options?: UseMutationOptions<Response<StoreOrderEditsRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.orderEdits.complete(id),
    buildOptions(
      queryClient,
      [orderEditQueryKeys.lists(), orderEditQueryKeys.detail(id)],
      options
    )
  )
}
