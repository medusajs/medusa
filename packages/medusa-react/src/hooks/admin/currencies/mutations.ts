import {
  AdminCurrenciesRes,
  AdminPostCurrenciesCurrencyReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminCurrenciesKeys } from "./queries"

/**
 * This hook updates a currency's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateCurrency } from "medusa-react"
 *
 * type Props = {
 *   currencyCode: string
 * }
 *
 * const Currency = ({ currencyCode }: Props) => {
 *   const updateCurrency = useAdminUpdateCurrency(currencyCode)
 *   // ...
 *
 *   const handleUpdate = (includes_tax: boolean) => {
 *     updateCurrency.mutate({
 *       includes_tax,
 *     }, {
 *       onSuccess: ({ currency }) => {
 *         console.log(currency)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Currency
 *
 * @customNamespace Hooks.Admin.Currencies
 * @category Mutations
 */
export const useAdminUpdateCurrency = (
  /**
   * The currency's code.
   */
  code: string,
  options?: UseMutationOptions<
    Response<AdminCurrenciesRes>,
    Error,
    AdminPostCurrenciesCurrencyReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostCurrenciesCurrencyReq) =>
      client.admin.currencies.update(code, payload),
    ...buildOptions(
      queryClient,
      [adminCurrenciesKeys.lists(), adminCurrenciesKeys.detail(code)],
      options
    ),
  })
}
