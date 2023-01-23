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

export const useAdminUpdateStore = (
  options?: UseMutationOptions<
    Response<AdminStoresRes>,
    Error,
    AdminPostStoreReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostStoreReq) => client.admin.store.update(payload),
    buildOptions(queryClient, adminStoreKeys.details(), options)
  )
}

export const useAdminAddStoreCurrency = (
  options?: UseMutationOptions<Response<AdminStoresRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (currency_code: string) => client.admin.store.deleteCurrency(currency_code),
    buildOptions(queryClient, adminStoreKeys.details(), options)
  )
}

export const useAdminDeleteStoreCurrency = (
  options?: UseMutationOptions<Response<AdminStoresRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (currency_code: string) => client.admin.store.deleteCurrency(currency_code),
    buildOptions(queryClient, adminStoreKeys.details(), options)
  )
}
