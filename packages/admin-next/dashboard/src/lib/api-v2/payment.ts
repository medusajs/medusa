import { useAdminCustomQuery } from "medusa-react"
import { V2ListRes } from "./types/common"
import { PaymentProviderDTO } from "@medusajs/types"

export const useV2PaymentProviders = (query?: any, options?: any) => {
  const { data, ...rest } = useAdminCustomQuery(
    "/admin/payments/payment-providers",
    [],
    query,
    options
  )

  const typedData: {
    payment_providers: PaymentProviderDTO[] | undefined
  } & V2ListRes = {
    payment_providers: data?.payment_providers,
    count: data?.count,
    offset: data?.offset,
    limit: data?.limit,
  }

  return { ...typedData, ...rest }
}
