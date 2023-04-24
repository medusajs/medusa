import { BalanceTransaction, BalanceWithAmounts } from "@medusajs/medusa"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const BALANCE_QUERY_KEY = `balance` as const
const BALANCE_TRANSACTION_QUERY_KEY = `balance-transaction` as const
const VENDOR_BALANCE_QUERY_KEY = `vendor-balance` as const
const STORE_BALANCE_QUERY_KEY = `store-balance` as const

export const balanceKeys = queryKeysFactory(BALANCE_QUERY_KEY)
export const balanceTransactionKeys = queryKeysFactory(
  BALANCE_TRANSACTION_QUERY_KEY
)
export const vendorBalanceKeys = queryKeysFactory(VENDOR_BALANCE_QUERY_KEY)
export const storeBalanceKeys = queryKeysFactory(STORE_BALANCE_QUERY_KEY)

export const useGetVendorBalance = (
  vendorId: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ balance: BalanceWithAmounts }>,
    Error,
    ReturnType<any>
  >
) => {
  const path = `/admin/vendors/${vendorId}/balance`

  const { data, refetch, ...rest } = useQuery(
    vendorBalanceKeys.detail(vendorId),
    () => medusaRequest<{ balance: BalanceWithAmounts }>("GET", path),
    options
  )

  return { ...data?.data, ...rest, refetch } as const
}

export const useGetStoreBalance = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ balance: BalanceWithAmounts }>,
    Error,
    ReturnType<any>
  >
) => {
  const path = `/admin/store/balance`

  const { data, refetch, ...rest } = useQuery(
    vendorBalanceKeys.details(),
    () => medusaRequest<{ balance: BalanceWithAmounts }>("GET", path),
    options
  )
  return { ...data?.data, ...rest, refetch } as const
}

export const useGetBalance = (
  balanceId: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ balance: BalanceWithAmounts }>,
    Error,
    ReturnType<any>
  >
) => {
  const path = `/admin/balance/${balanceId}`

  const { data, refetch, ...rest } = useQuery(
    balanceKeys.detail(balanceId),
    () => medusaRequest<{ balance: BalanceWithAmounts }>("GET", path),
    options
  )
  return { ...data?.data, ...rest, refetch } as const
}

export type BalanceTransactionResponseData = {
  transactions: BalanceTransaction[]
  count: number
  offset: number
  limit: number
}

export const useGetBalanceTransactions = (
  query: { balance_id: string; offset?: number; limit?: number },
  options?: UseQueryOptionsWrapper<
    AxiosResponse<BalanceTransactionResponseData>,
    Error,
    ReturnType<any>
  >
) => {
  const { balance_id, ...filters } = query

  const path = `/admin/balance/${balance_id}/transactions?${Object.entries(
    filters
  )
    .map(([key, value]) => `${key}=${value}`)
    .join("&")}`

  const { data, refetch, ...rest } = useQuery(
    [balanceTransactionKeys.list(query)],
    () => medusaRequest<BalanceTransactionResponseData>("GET", path),
    options
  )
  return { ...data?.data, ...rest, refetch } as const
}
