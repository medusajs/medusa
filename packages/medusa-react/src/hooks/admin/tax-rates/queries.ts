import {
  AdminGetTaxRatesParams,
  AdminTaxRatesListRes,
  AdminTaxRatesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_TAX_RATES_QUERY_KEY = `admin_tax_rates` as const

export const adminTaxRateKeys = queryKeysFactory(ADMIN_TAX_RATES_QUERY_KEY)

type TaxRateQueryKeys = typeof adminTaxRateKeys

/**
 * This hook retrieves a list of tax rates. The tax rates can be filtered by fields such as `name` or `rate`
 * passed in the `query` parameter. The tax rates can also be paginated.
 *
 * @example
 * To list tax rates:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminTaxRates } from "medusa-react"
 *
 * const TaxRates = () => {
 *   const {
 *     tax_rates,
 *     isLoading
 *   } = useAdminTaxRates()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {tax_rates && !tax_rates.length && (
 *         <span>No Tax Rates</span>
 *       )}
 *       {tax_rates && tax_rates.length > 0 && (
 *         <ul>
 *           {tax_rates.map((tax_rate) => (
 *             <li key={tax_rate.id}>{tax_rate.code}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default TaxRates
 * ```
 *
 * To specify relations that should be retrieved within the tax rates:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminTaxRates } from "medusa-react"
 *
 * const TaxRates = () => {
 *   const {
 *     tax_rates,
 *     isLoading
 *   } = useAdminTaxRates({
 *     expand: ["shipping_options"]
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {tax_rates && !tax_rates.length && (
 *         <span>No Tax Rates</span>
 *       )}
 *       {tax_rates && tax_rates.length > 0 && (
 *         <ul>
 *           {tax_rates.map((tax_rate) => (
 *             <li key={tax_rate.id}>{tax_rate.code}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default TaxRates
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminTaxRates } from "medusa-react"
 *
 * const TaxRates = () => {
 *   const {
 *     tax_rates,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminTaxRates({
 *     expand: ["shipping_options"],
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {tax_rates && !tax_rates.length && (
 *         <span>No Tax Rates</span>
 *       )}
 *       {tax_rates && tax_rates.length > 0 && (
 *         <ul>
 *           {tax_rates.map((tax_rate) => (
 *             <li key={tax_rate.id}>{tax_rate.code}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default TaxRates
 * ```
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Queries
 */
export const useAdminTaxRates = (
  /**
   * Filters and pagination configurations applied to the retrieved tax rates.
   */
  query?: AdminGetTaxRatesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminTaxRatesListRes>,
    Error,
    ReturnType<TaxRateQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminTaxRateKeys.list(query),
    queryFn: () => client.admin.taxRates.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a tax rate's details.
 *
 * @example
 * A simple example that retrieves a tax rate by its ID:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminTaxRate } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const { tax_rate, isLoading } = useAdminTaxRate(taxRateId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {tax_rate && <span>{tax_rate.code}</span>}
 *     </div>
 *   )
 * }
 *
 * export default TaxRate
 * ```
 *
 * To specify relations that should be retrieved:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminTaxRate } from "medusa-react"
 *
 * const TaxRate = (taxRateId: string) => {
 *   const { tax_rate, isLoading } = useAdminTaxRate(taxRateId, {
 *     expand: ["shipping_options"]
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {tax_rate && <span>{tax_rate.code}</span>}
 *     </div>
 *   )
 * }
 *
 * export default TaxRate
 * ```
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Queries
 */
export const useAdminTaxRate = (
  /**
   * The tax rate's ID.
   */
  id: string,
  /**
   * Configurations to apply on retrieved tax rates.
   */
  query?: AdminGetTaxRatesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminTaxRatesRes>,
    Error,
    ReturnType<TaxRateQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminTaxRateKeys.detail(id),
    queryFn: () => client.admin.taxRates.retrieve(id, query),
    ...options,
  })
  return { ...data, ...rest } as const
}
