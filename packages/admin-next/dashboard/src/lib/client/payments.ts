import { HttpTypes } from "@medusajs/types"
import { PaymentProvidersListRes } from "../../types/api-responses"
import { getRequest } from "./common"

async function retrievePayment(id: string, query?: Record<string, any>) {
  return getRequest<HttpTypes.AdminPaymentResponse>(
    `/admin/payments/${id}`,
    query
  )
}

async function listPaymentProviders(query?: Record<string, any>) {
  return getRequest<PaymentProvidersListRes, Record<string, any>>(
    `/admin/payments/payment-providers`,
    query
  )
}

export const payments = {
  listPaymentProviders,
  retrievePayment,
}
