import { AdminPaymentCollectionsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const PAYMENT_COLLECTION_QUERY_KEY = `paymentCollection` as const

export const adminPaymentCollectionQueryKeys = queryKeysFactory<
  typeof PAYMENT_COLLECTION_QUERY_KEY
>(PAYMENT_COLLECTION_QUERY_KEY)

type AdminPaymentCollectionKey = typeof adminPaymentCollectionQueryKeys

/**
 * This hook retrieves a Payment Collection's details.
 *
 * @example
 * import React from "react"
 * import { useAdminPaymentCollection } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({ paymentCollectionId }: Props) => {
 *   const {
 *     payment_collection,
 *     isLoading,
 *   } = useAdminPaymentCollection(paymentCollectionId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {payment_collection && (
 *         <span>{payment_collection.status}</span>
 *       )}
 *
 *     </div>
 *   )
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Admin.Payment Collections
 * @category Queries
 */
export const useAdminPaymentCollection = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminPaymentCollectionsRes>,
    Error,
    ReturnType<AdminPaymentCollectionKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminPaymentCollectionQueryKeys.detail(id),
    queryFn: () => client.admin.paymentCollections.retrieve(id),
    ...options,
  })

  return { ...data, ...rest } as const
}
