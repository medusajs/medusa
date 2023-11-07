import { Response } from "@medusajs/medusa-js"
import {
useMutation,
UseMutationOptions,
useQueryClient,
} from "@tanstack/react-query"
import { adminInviteKeys, useMedusa } from "medusa-react"
import { buildOptions } from "../utils/build-options"

type PasswordFormData = {
  password: string
  repeat_password: string
}

export const useAdminChangePassword = (
options?: UseMutationOptions<Response<void>, Error, PasswordFormData>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  const changePassword = (payload: PasswordFormData) => {
    const path = `/admin/user/change-password`
    return client.admin.users.client.request("POST", path, payload);
  }

  return useMutation(
    (payload: PasswordFormData) => changePassword(payload),
    buildOptions(queryClient, [], options)
  )
}
