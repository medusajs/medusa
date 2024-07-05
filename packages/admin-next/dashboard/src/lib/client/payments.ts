import { getRequest } from "./common"
import { PaymentProvidersListRes } from "../../types/api-responses"

async function listPaymentProviders(query?: Record<string, any>) {
  return getRequest<PaymentProvidersListRes, Record<string, any>>(
    `/admin/payments/payment-providers`,
    query
  )
}

export const payments = {
  listPaymentProviders,
}
