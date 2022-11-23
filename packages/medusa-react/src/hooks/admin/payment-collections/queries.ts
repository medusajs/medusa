import { queryKeysFactory } from "../../utils"
import { StorePaymentCollectionRes } from "@medusajs/medusa"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { Response } from "@medusajs/medusa-js"

const PAYMENT_COLLECTION_QUERY_KEY = `paymentCollection` as const

export const paymentCollectionQueryKeys = queryKeysFactory<
  typeof PAYMENT_COLLECTION_QUERY_KEY
>(PAYMENT_COLLECTION_QUERY_KEY)

type OrderQueryKey = typeof paymentCollectionQueryKeys

export const usePaymentCollection = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StorePaymentCollectionRes>,
    Error,
    ReturnType<OrderQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    paymentCollectionQueryKeys.detail(id),
    () => client.admin.paymentCollections.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}
