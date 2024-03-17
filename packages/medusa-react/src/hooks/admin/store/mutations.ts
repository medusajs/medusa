import { AdminPostStoreReq, AdminStoresRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminStoreKeys } from "./queries"

/**
 * This hook updates the store's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateStore } from "medusa-react"
 *
 * function Store() {
 *   const updateStore = useAdminUpdateStore()
 *   // ...
 *
 *   const handleUpdate = (
 *     name: string
 *   ) => {
 *     updateStore.mutate({
 *       name
 *     }, {
 *       onSuccess: ({ store }) => {
 *         console.log(store.name)
 *       }
 *     })
 *   }
 * }
 *
 * export default Store
 *
 * @customNamespace Hooks.Admin.Stores
 * @category Mutations
 */
export const useAdminUpdateStore = (
  options?: UseMutationOptions<
    Response<AdminStoresRes>,
    Error,
    AdminPostStoreReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostStoreReq) =>
      client.admin.store.update(payload),
    ...buildOptions(queryClient, adminStoreKeys.details(), options),
  })
}

/**
 * This hook adds a currency code to the available currencies in a store. This doesn't create new currencies, as currencies are defined within the Medusa backend.
 * To create a currency, you can [create a migration](https://docs.medusajs.com/development/entities/migrations/create) that inserts the currency into the database.
 *
 * @typeParamDefinition string - The code of the currency to add to the store.
 *
 * @example
 * import React from "react"
 * import { useAdminAddStoreCurrency } from "medusa-react"
 *
 * const Store = () => {
 *   const addCurrency = useAdminAddStoreCurrency()
 *   // ...
 *
 *   const handleAdd = (code: string) => {
 *     addCurrency.mutate(code, {
 *       onSuccess: ({ store }) => {
 *         console.log(store.currencies)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Store
 *
 * @customNamespace Hooks.Admin.Stores
 * @category Mutations
 */
export const useAdminAddStoreCurrency = (
  options?: UseMutationOptions<Response<AdminStoresRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (currency_code: string) =>
      client.admin.store.addCurrency(currency_code),
    ...buildOptions(queryClient, adminStoreKeys.details(), options),
  })
}

/**
 * This hook deletes a currency code from the available currencies in a store. This doesn't completely
 * delete the currency and it can be added again later to the store.
 *
 * @typeParamDefinition string - The code of the currency to remove from the store.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteStoreCurrency } from "medusa-react"
 *
 * const Store = () => {
 *   const deleteCurrency = useAdminDeleteStoreCurrency()
 *   // ...
 *
 *   const handleAdd = (code: string) => {
 *     deleteCurrency.mutate(code, {
 *       onSuccess: ({ store }) => {
 *         console.log(store.currencies)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Store
 *
 * @customNamespace Hooks.Admin.Stores
 * @category Mutations
 */
export const useAdminDeleteStoreCurrency = (
  options?: UseMutationOptions<Response<AdminStoresRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (currency_code: string) =>
      client.admin.store.deleteCurrency(currency_code),
    ...buildOptions(queryClient, adminStoreKeys.details(), options),
  })
}
