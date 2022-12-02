import { queryKeysFactory } from "../../utils"
import { AdminPaymentCollectionsRes } from "@medusajs/medusa"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { Response } from "@medusajs/medusa-js"

const PAYMENT_COLLECTION_QUERY_KEY = `paymentCollection` as const

export const adminPaymentCollectionQueryKeys = queryKeysFactory<
  typeof PAYMENT_COLLECTION_QUERY_KEY
>(PAYMENT_COLLECTION_QUERY_KEY)

type AdminPaymentCollectionKey = typeof adminPaymentCollectionQueryKeys

export const useAdminPaymentCollection = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminPaymentCollectionsRes>,
    Error,
    ReturnType<AdminPaymentCollectionKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminPaymentCollectionQueryKeys.detail(id),
    () => client.admin.paymentCollections.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}
