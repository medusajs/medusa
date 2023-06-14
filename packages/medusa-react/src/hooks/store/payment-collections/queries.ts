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

export const usePaymentCollection = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StorePaymentCollectionsRes>,
    Error,
    ReturnType<PaymentCollectionKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    paymentCollectionQueryKeys.detail(id),
    () => client.paymentCollections.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}
