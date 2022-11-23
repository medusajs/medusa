import { queryKeysFactory } from "../../utils"
import { AdminPaymentRes } from "@medusajs/medusa"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { Response } from "@medusajs/medusa-js"

const PAYMENT_QUERY_KEY = `payment` as const

export const paymentQueryKeys =
  queryKeysFactory<typeof PAYMENT_QUERY_KEY>(PAYMENT_QUERY_KEY)

type OrderQueryKey = typeof paymentQueryKeys

export const usePayment = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminPaymentRes>,
    Error,
    ReturnType<OrderQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    paymentQueryKeys.detail(id),
    () => client.admin.payments.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}
