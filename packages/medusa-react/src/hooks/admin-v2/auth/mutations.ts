import { AdminAuthRes, AdminPostAuthReq } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminV2AuthKeys } from "./queries"

export const useAdminV2Login = (
  options?: UseMutationOptions<Response<AdminAuthRes>, Error, AdminPostAuthReq>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostAuthReq) => client.adminV2.auth.createSession(payload),
    buildOptions(queryClient, adminV2AuthKeys.details(), options)
  )
}

export const useAdminV2DeleteSession = (
  options?: UseMutationOptions<Response<void>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.auth.deleteSession(),
    buildOptions(queryClient, adminV2AuthKeys.details(), options)
  )
}
