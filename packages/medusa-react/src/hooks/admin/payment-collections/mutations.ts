import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  AdminPaymentCollectionDeleteRes,
  AdminPaymentCollectionRes,
  AdminUpdatePaymentCollectionRequest,
} from "@medusajs/medusa"

import { buildOptions } from "../../utils/buildOptions"
import { useMedusa } from "../../../contexts"
import { paymentCollectionQueryKeys } from "."

export const useAdminDeletePaymentCollection = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPaymentCollectionDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.paymentCollections.delete(id),
    buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.detail(id),
        paymentCollectionQueryKeys.lists(),
      ],
      options
    )
  )
}

export const useAdminUpdatePaymentCollection = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPaymentCollectionRes>,
    Error,
    AdminUpdatePaymentCollectionRequest
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminUpdatePaymentCollectionRequest) =>
      client.admin.paymentCollections.update(id, payload),
    buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.detail(id),
        paymentCollectionQueryKeys.lists(),
      ],
      options
    )
  )
}

export const useAdminMarkPaymentCollectionAsAuthorized = (
  id: string,
  options?: UseMutationOptions<Response<AdminPaymentCollectionRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.paymentCollections.markAsAuthorized(id),
    buildOptions(
      queryClient,
      [
        paymentCollectionQueryKeys.detail(id),
        paymentCollectionQueryKeys.lists(),
      ],
      options
    )
  )
}
