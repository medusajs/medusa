import { AdminPaymentRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const PAYMENT_QUERY_KEY = `payment` as const

export const adminPaymentQueryKeys =
  queryKeysFactory<typeof PAYMENT_QUERY_KEY>(PAYMENT_QUERY_KEY)

type AdminPaymentKey = typeof adminPaymentQueryKeys

export const useAdminPayment = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminPaymentRes>,
    Error,
    ReturnType<AdminPaymentKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminPaymentQueryKeys.detail(id),
    () => client.admin.payments.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}
