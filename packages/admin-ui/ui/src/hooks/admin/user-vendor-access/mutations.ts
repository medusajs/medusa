import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"
import { AccessLevelEnum } from "../invites"

export interface AdminPostVendorAccessReq {
  vendor_id: string
  user_id: string
  access_level: AccessLevelEnum
}

export interface AdminDeleteVendorAccessReq {
  vendor_id: string
  user_id: string
}

export const useAdminUpdateVendorAccess = () => {
  const path = `/admin/vendor/access`

  return useMutation((payload: AdminPostVendorAccessReq) =>
    medusaRequest<any>("POST", path, payload)
  )
}

export const useAdminDeleteStoreAccess = () => {
  const path = `/admin/vendor/access`

  return useMutation((payload: AdminDeleteVendorAccessReq) =>
    medusaRequest<any>("DELETE", path, payload)
  )
}
