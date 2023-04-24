import { useMutation, useQueryClient } from "react-query"
import Stripe from "stripe"
import medusaRequest from "../../../services/request"
import { buildOptions } from "../../utils/buildOptions"
import { balanceKeys, balanceTransactionKeys } from "../balances/queries"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { AxiosResponse } from "axios"
import { PayoutsAccountLinkRes } from "./queries"

export interface AdminCreatePayoutRequestReq {
  amount: number
}

export interface AdminCreateTopupRequestReq {
  amount: number
}

export interface AdminCreatePayoutRequestRes {
  payout: Stripe.Payout
}

export interface AdminCreateTopupResponse {
  topup: Stripe.Charge
}

export const useGetPayoutAccountLink = (
  balanceId?: string,
  vendorId?: string
) => {
  const path = `/admin/balance/${balanceId}/payouts/account-link`

  return useMutation(() =>
    medusaRequest<PayoutsAccountLinkRes>("POST", path, {
      vendor_id: vendorId,
    })
  )
}

export const useAdminCreatePayout = (balanceId: string) => {
  const path = `/admin/balance/${balanceId}/payouts`
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminCreatePayoutRequestReq) =>
      medusaRequest<AdminCreatePayoutRequestRes>("POST", path, payload),
    buildOptions(queryClient, [
      balanceKeys.detail(balanceId),
      balanceTransactionKeys.list(balanceId),
    ])
  )
}

export const useAdminCreateTopup = (balanceId: string) => {
  const path = `/admin/balance/${balanceId}/topups`
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminCreateTopupRequestReq) =>
      medusaRequest<AdminCreateTopupResponse>("POST", path, payload),
    buildOptions(queryClient, [
      balanceKeys.detail(balanceId),
      balanceTransactionKeys.list(balanceId),
    ])
  )
}
