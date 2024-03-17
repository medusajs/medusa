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

/**
 * This hook retrieves a list of currencies. The currencies can be filtered by fields such as `code`.
 * The currencies can also be sorted or paginated.
 *
 * @example
 * To list currencies:
 *
 * ```ts
 * import React from "react"
 * import { useAdminCurrencies } from "medusa-react"
 *
 * const Currencies = () => {
 *   const { currencies, isLoading } = useAdminCurrencies()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {currencies && !currencies.length && (
 *         <span>No Currencies</span>
 *       )}
 *       {currencies && currencies.length > 0 && (
 *         <ul>
 *           {currencies.map((currency) => (
 *             <li key={currency.code}>{currency.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Currencies
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```ts
 * import React from "react"
 * import { useAdminCurrencies } from "medusa-react"
 *
 * const Currencies = () => {
 *   const { currencies, limit, offset, isLoading } = useAdminCurrencies({
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {currencies && !currencies.length && (
 *         <span>No Currencies</span>
 *       )}
 *       {currencies && currencies.length > 0 && (
 *         <ul>
 *           {currencies.map((currency) => (
 *             <li key={currency.code}>{currency.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Currencies
 * ```
 *
 * @customNamespace Hooks.Admin.Currencies
 * @category Queries
 */
export const useAdminCurrencies = (
  /**
   * Filters and pagination configurations to apply on retrieved currencies.
   */
  query?: AdminGetCurrenciesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCurrenciesListRes>,
    Error,
    ReturnType<CurrenciesQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminCurrenciesKeys.list(query),
    queryFn: () => client.admin.currencies.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
