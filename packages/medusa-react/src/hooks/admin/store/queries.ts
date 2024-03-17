import {
  AdminExtendedStoresRes,
  AdminPaymentProvidersList,
  AdminTaxProvidersList,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_STORE_QUERY_KEY = `admin_store` as const

export const adminStoreKeys = queryKeysFactory(ADMIN_STORE_QUERY_KEY)

type StoreQueryKeys = typeof adminStoreKeys

/**
 * This hook retrieves a list of available payment providers in a store.
 *
 * @example
 * import React from "react"
 * import { useAdminStorePaymentProviders } from "medusa-react"
 *
 * const PaymentProviders = () => {
 *   const {
 *     payment_providers,
 *     isLoading
 *   } = useAdminStorePaymentProviders()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {payment_providers && !payment_providers.length && (
 *         <span>No Payment Providers</span>
 *       )}
 *       {payment_providers &&
 *         payment_providers.length > 0 &&(
 *           <ul>
 *             {payment_providers.map((provider) => (
 *               <li key={provider.id}>{provider.id}</li>
 *             ))}
 *           </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PaymentProviders
 *
 * @customNamespace Hooks.Admin.Stores
 * @category Queries
 */
export const useAdminStorePaymentProviders = (
  options?: UseQueryOptionsWrapper<
    Response<AdminPaymentProvidersList>,
    Error,
    ReturnType<StoreQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminStoreKeys.detail("payment_providers"),
    queryFn: () => client.admin.store.listPaymentProviders(),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of available tax providers in a store.
 *
 * @example
 * import React from "react"
 * import { useAdminStoreTaxProviders } from "medusa-react"
 *
 * const TaxProviders = () => {
 *   const {
 *     tax_providers,
 *     isLoading
 *   } = useAdminStoreTaxProviders()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {tax_providers && !tax_providers.length && (
 *         <span>No Tax Providers</span>
 *       )}
 *       {tax_providers &&
 *         tax_providers.length > 0 &&(
 *           <ul>
 *             {tax_providers.map((provider) => (
 *               <li key={provider.id}>{provider.id}</li>
 *             ))}
 *           </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default TaxProviders
 *
 * @customNamespace Hooks.Admin.Stores
 * @category Queries
 */
export const useAdminStoreTaxProviders = (
  options?: UseQueryOptionsWrapper<
    Response<AdminTaxProvidersList>,
    Error,
    ReturnType<StoreQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminStoreKeys.detail("tax_providers"),
    queryFn: () => client.admin.store.listTaxProviders(),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves the store's details.
 *
 * @example
 * import React from "react"
 * import { useAdminStore } from "medusa-react"
 *
 * const Store = () => {
 *   const {
 *     store,
 *     isLoading
 *   } = useAdminStore()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {store && <span>{store.name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Store
 *
 * @customNamespace Hooks.Admin.Stores
 * @category Queries
 */
export const useAdminStore = (
  options?: UseQueryOptionsWrapper<
    Response<AdminExtendedStoresRes>,
    Error,
    ReturnType<StoreQueryKeys["details"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminStoreKeys.details(),
    queryFn: () => client.admin.store.retrieve(),
    ...options,
  })
  return { ...data, ...rest } as const
}
