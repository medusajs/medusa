import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  StorePaymentCollectionRes,
  StoreManagePaymentCollectionSessionRequest,
  StoreRefreshPaymentCollectionSessionRequest,
} from "@medusajs/medusa"

import { buildOptions } from "../../utils/buildOptions"
import { useMedusa } from "../../../contexts"
import { paymentCollectionQueryKeys } from "."

export const useManagePaymentSessions = (
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
      client.paymentCollections.manageSessions(id, payload),
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

export const useAuthorize = (
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

export const useRefreshPaymentSession = (
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionRes>,
    Error,
    StoreRefreshPaymentCollectionSessionRequest
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (
      sessionId: string,
      payload: StoreRefreshPaymentCollectionSessionRequest
    ) => {
      return client.paymentCollections.refreshPaymentSession(
        id,
        sessionId,
        payload
      )
    },
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
