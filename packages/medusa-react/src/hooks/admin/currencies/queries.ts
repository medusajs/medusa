import {
  AdminCurrenciesListRes,
  AdminGetCurrenciesParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_CURRENCIES_QUERY_KEY = `admin_currencies` as const

export const adminCurrenciesKeys = queryKeysFactory(ADMIN_CURRENCIES_QUERY_KEY)

type CurrenciesQueryKey = typeof adminCurrenciesKeys

export const useAdminCurrencies = (
  query?: AdminGetCurrenciesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCurrenciesListRes>,
    Error,
    ReturnType<CurrenciesQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCurrenciesKeys.list(query),
    () => client.admin.currencies.list(query),
    options
  )
  return { ...data, ...rest } as const
}
