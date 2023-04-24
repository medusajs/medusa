import Stripe from "stripe"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"

export interface PayoutsAccountLinkRes {
  link: Stripe.AccountLink
}

export interface PayoutsAccountRes {
  account: Stripe.Account
}

export const useGetPayoutAccountLink = (
  balanceId?: string,
  vendorId?: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<PayoutsAccountLinkRes>,
    Error,
    ReturnType<any>
  >
) => {
  const path = `/admin/balance/${balanceId}/payouts/account-link`

  const { data, refetch, ...rest } = useQuery(
    path,
    () =>
      medusaRequest<PayoutsAccountLinkRes>("POST", path, {
        vendor_id: vendorId,
      }),
    options
  )

  return { ...data?.data, ...rest, refetch } as const
}

export const useGetPayoutsAccount = (
  balanceId?: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<PayoutsAccountRes>,
    Error,
    ReturnType<any>
  >
) => {
  const path = `/admin/balance/${balanceId}/payouts/account`

  const { data, refetch, ...rest } = useQuery(
    path,
    () => medusaRequest<PayoutsAccountRes>("GET", path),
    options
  )

  return { ...data?.data, ...rest, refetch } as const
}
