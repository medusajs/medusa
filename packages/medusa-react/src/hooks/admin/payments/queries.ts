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

/**
 * This hook retrieves a payment's details.
 *
 * @example
 * import React from "react"
 * import { useAdminPayment } from "medusa-react"
 *
 * type Props = {
 *   paymentId: string
 * }
 *
 * const Payment = ({ paymentId }: Props) => {
 *   const {
 *     payment,
 *     isLoading,
 *   } = useAdminPayment(paymentId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {payment && <span>{payment.amount}</span>}
 *
 *     </div>
 *   )
 * }
 *
 * export default Payment
 *
 * @customNamespace Hooks.Admin.Payments
 * @category Queries
 */
export const useAdminPayment = (
  /**
   * The payment's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminPaymentRes>,
    Error,
    ReturnType<AdminPaymentKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminPaymentQueryKeys.detail(id),
    queryFn: () => client.admin.payments.retrieve(id),
    ...options,
  })

  return { ...data, ...rest } as const
}
