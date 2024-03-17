import { StorePaymentCollectionsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const PAYMENT_COLLECTION_QUERY_KEY = `paymentCollection` as const

export const paymentCollectionQueryKeys = queryKeysFactory<
  typeof PAYMENT_COLLECTION_QUERY_KEY
>(PAYMENT_COLLECTION_QUERY_KEY)

type PaymentCollectionKey = typeof paymentCollectionQueryKeys

/**
 * This hook retrieves a Payment Collection's details.
 *
 * @example
 * import React from "react"
 * import { usePaymentCollection } from "medusa-react"
 *
 * type Props = {
 *   paymentCollectionId: string
 * }
 *
 * const PaymentCollection = ({
 *   paymentCollectionId
 * }: Props) => {
 *   const {
 *     payment_collection,
 *     isLoading
 *   } = usePaymentCollection(
 *     paymentCollectionId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {payment_collection && (
 *         <span>{payment_collection.status}</span>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PaymentCollection
 *
 * @customNamespace Hooks.Store.Payment Collections
 * @category Queries
 */
export const usePaymentCollection = (
  /**
   * The payment collection's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StorePaymentCollectionsRes>,
    Error,
    ReturnType<PaymentCollectionKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: paymentCollectionQueryKeys.detail(id),
    queryFn: () => client.paymentCollections.retrieve(id),
    ...options,
  })

  return { ...data, ...rest } as const
}
