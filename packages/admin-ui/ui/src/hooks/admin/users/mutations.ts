import { AdminUpdateUserRequest, AdminUserRes } from "@medusajs/medusa/dist/api"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"

export const useAdminUpdateUser = (user_id) => {
  const path = `/admin/users/${user_id}`

  return useMutation((payload: AdminUpdateUserRequest) =>
    medusaRequest<AdminUserRes>("POST", path, payload)
  )
}
