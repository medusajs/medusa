import { AdminAuthRes, AdminPostAuthReq } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminAuthKeys } from "./queries"

export const useAdminLogin = (
  options?: UseMutationOptions<Response<AdminAuthRes>, Error, AdminPostAuthReq>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostAuthReq) => client.admin.auth.createSession(payload),
    buildOptions(queryClient, adminAuthKeys.details(), options)
  )
}

export const useAdminDeleteSession = (
  options?: UseMutationOptions<Response<void>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.auth.deleteSession(),
    buildOptions(queryClient, adminAuthKeys.details(), options)
  )
}
