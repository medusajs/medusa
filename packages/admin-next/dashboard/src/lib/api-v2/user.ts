import { AdminUpdateUserRequest } from "@medusajs/medusa"
import { useMutation } from "@tanstack/react-query"
import { medusa } from "../medusa"

export const useV2AdminUpdateUser = (id?: string, options?: any) => {
  return useMutation(
    (payload: AdminUpdateUserRequest) =>
      medusa.client.request("POST", `/admin/users/${id}`, payload),
    {
      ...options,
    }
  )
}
