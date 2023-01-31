import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  StorePaymentCollectionSessionsReq,
  StorePaymentCollectionsRes,
  StorePaymentCollectionsSessionRes,
  StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
  StorePostPaymentCollectionsBatchSessionsReq,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { paymentCollectionQueryKeys } from "./queries"

export const useManageMultiplePaymentSessions = (
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionsRes>,
    Error,
    StorePostPaymentCollectionsBatchSessionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: StorePostPaymentCollectionsBatchSessionsReq) =>
      client.paymentCollections.managePaymentSessionsBatch(id, payload),
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
    Response<StorePaymentCollectionsRes>,
    Error,
    StorePaymentCollectionSessionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: StorePaymentCollectionSessionsReq) =>
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

export const useAuthorizePaymentSession = (
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionsRes>,
    Error,
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (session_id: string) =>
      client.paymentCollections.authorizePaymentSession(id, session_id),
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

export const useAuthorizePaymentSessionsBatch = (
  id: string,
  options?: UseMutationOptions<
    Response<StorePaymentCollectionsRes>,
    Error,
    StorePostPaymentCollectionsBatchSessionsAuthorizeReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload) =>
      client.paymentCollections.authorizePaymentSessionsBatch(id, payload),
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
    Response<StorePaymentCollectionsSessionRes>,
    Error,
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (session_id: string) =>
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
