import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  StorePostOrderEditsOrderEditDecline,
  StoreOrderEditsRes
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
