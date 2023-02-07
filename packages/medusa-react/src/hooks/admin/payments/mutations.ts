import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  AdminPaymentRes,
  AdminPostPaymentRefundsReq,
  AdminRefundRes,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminPaymentQueryKeys } from "./queries"

export const useAdminPaymentsCapturePayment = (
  id: string,
  options?: UseMutationOptions<Response<AdminPaymentRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.payments.capturePayment(id),
    buildOptions(
      queryClient,
      [adminPaymentQueryKeys.detail(id), adminPaymentQueryKeys.lists()],
      options
    )
  )
}

export const useAdminPaymentsRefundPayment = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminRefundRes>,
    Error,
    AdminPostPaymentRefundsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostPaymentRefundsReq) =>
      client.admin.payments.refundPayment(id, payload),
    buildOptions(
      queryClient,
      [adminPaymentQueryKeys.detail(id), adminPaymentQueryKeys.lists()],
      options
    )
  )
}
