import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  StorePostCustomersCustomerAcceptClaimReq,
  StorePostCustomersCustomerOrderClaimReq,
} from "@medusajs/medusa"

import { buildOptions } from "../../utils/buildOptions"
import { useMedusa } from "../../../contexts"
import { orderKeys } from "."

export const useRequestOrderAccess = (
  options?: UseMutationOptions<
    Response<{}>,
    Error,
    StorePostCustomersCustomerOrderClaimReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: StorePostCustomersCustomerOrderClaimReq) =>
      client.orders.requestCustomerOrders(payload),
    buildOptions(queryClient, [orderKeys.all], options)
  )
}
export const useGrantOrderAccess = (
  options?: UseMutationOptions<
    Response<{}>,
    Error,
    StorePostCustomersCustomerAcceptClaimReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: StorePostCustomersCustomerAcceptClaimReq) =>
      client.orders.confirmRequest(payload),
    buildOptions(queryClient, [orderKeys.all], options)
  )
}
