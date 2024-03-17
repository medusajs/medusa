import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  AdminPaymentCollectionDeleteRes,
  AdminPaymentCollectionsRes,
  AdminUpdatePaymentCollectionsReq,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminPaymentCollectionQueryKeys } from "./queries"

/**
 * This hook deletes a payment collection. Only payment collections with the statuses `canceled` or `not_paid` can be deleted.
 *
 * @example
 * import React from "react"
 * import { useAdminDeletePaymentCollection } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({ paymentCollectionId }: Props) => {
 *   const deleteCollection = useAdminDeletePaymentCollection(
 *     paymentCollectionId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteCollection.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Admin.Payment Collections
 * @category Mutations
 */
export const useAdminDeletePaymentCollection = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPaymentCollectionDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.paymentCollections.delete(id),
    ...buildOptions(
      queryClient,
      [
        adminPaymentCollectionQueryKeys.detail(id),
        adminPaymentCollectionQueryKeys.lists(),
      ],
      options
    ),
  })
}

/**
 * This hook updates a payment collection's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdatePaymentCollection } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({ paymentCollectionId }: Props) => {
 *   const updateCollection = useAdminUpdatePaymentCollection(
 *     paymentCollectionId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     description: string
 *   ) => {
 *     updateCollection.mutate({
 *       description
 *     }, {
 *       onSuccess: ({ payment_collection }) => {
 *         console.log(payment_collection.description)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Admin.Payment Collections
 * @category Mutations
 */
export const useAdminUpdatePaymentCollection = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPaymentCollectionsRes>,
    Error,
    AdminUpdatePaymentCollectionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminUpdatePaymentCollectionsReq) =>
      client.admin.paymentCollections.update(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminPaymentCollectionQueryKeys.detail(id),
        adminPaymentCollectionQueryKeys.lists(),
      ],
      options
    ),
  })
}

/**
 * This hook sets the status of a payment collection as `authorized`. This will also change the `authorized_amount` of the payment collection.
 *
 * @example
 * import React from "react"
 * import { useAdminMarkPaymentCollectionAsAuthorized } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({ paymentCollectionId }: Props) => {
 *   const markAsAuthorized = useAdminMarkPaymentCollectionAsAuthorized(
 *     paymentCollectionId
 *   )
 *   // ...
 *
 *   const handleAuthorization = () => {
 *     markAsAuthorized.mutate(void 0, {
 *       onSuccess: ({ payment_collection }) => {
 *         console.log(payment_collection.status)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Admin.Payment Collections
 * @category Mutations
 */
export const useAdminMarkPaymentCollectionAsAuthorized = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPaymentCollectionsRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.paymentCollections.markAsAuthorized(id),
    ...buildOptions(
      queryClient,
      [
        adminPaymentCollectionQueryKeys.detail(id),
        adminPaymentCollectionQueryKeys.lists(),
      ],
      options
    ),
  })
}
