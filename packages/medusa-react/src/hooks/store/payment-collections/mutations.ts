import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  StorePaymentCollectionRes,
  StoreManageMultiplePaymentCollectionSessionRequest,
  StoreManagePaymentCollectionSessionRequest,
  StorePaymentCollectionSessionRes,
} from "@medusajs/medusa"

import { buildOptions } from "../../utils/buildOptions"
import { useMedusa } from "../../../contexts"
import { paymentCollectionQueryKeys } from "."

export const useManageMultiplePaymentSessions = (
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionRes>,
    Error,
    StoreManageMultiplePaymentCollectionSessionRequest
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: StoreManageMultiplePaymentCollectionSessionRequest) =>
      client.paymentCollections.manageMultiplePaymentSessions(id, payload),
    buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    )
  )
}

export const useManagePaymentSession = (
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionRes>,
    Error,
    StoreManagePaymentCollectionSessionRequest
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: StoreManagePaymentCollectionSessionRequest) =>
      client.paymentCollections.managePaymentSession(id, payload),
    buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    )
  )
}

export const useAuthorizePayment = (
  id: string,
  options?: UseMutationOptions<Response<StorePaymentCollectionRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.paymentCollections.authorize(id),
    buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    )
  )
}

export const usePaymentCollectionRefreshPaymentSession = (
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionSessionRes>,
    Error,
    { session_id: string }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    ({ session_id }: { session_id: string }) =>
      client.paymentCollections.refreshPaymentSession(id, session_id),
    buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.lists(),
        paymentCollectionQueryKeys.detail(id),
      ],
      options
    )
  )
}
