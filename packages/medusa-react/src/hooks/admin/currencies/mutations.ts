import {
  AdminCurrenciesRes,
  AdminPostCurrenciesCurrencyReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { adminCurrenciesKeys } from "."
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"

export const useAdminUpdateCurrency = (
  code: string,
  options?: UseMutationOptions<
    Response<AdminCurrenciesRes>,
    Error,
    AdminPostCurrenciesCurrencyReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostCurrenciesCurrencyReq) =>
      client.admin.currencies.update(code, payload),
    buildOptions(
      queryClient,
      [adminCurrenciesKeys.lists(), adminCurrenciesKeys.detail(code)],
      options
    )
  )
}
