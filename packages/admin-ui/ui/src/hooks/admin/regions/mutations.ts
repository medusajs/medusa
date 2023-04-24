import { AdminRegionsRes } from "@medusajs/medusa/dist/api/routes/admin/regions"
import { AdminPostRegionsReq } from "@medusajs/medusa/dist/api/routes/admin/regions/create-region"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"

export interface AdminPostStoreReqExtended extends AdminPostRegionsReq {
  store_id: string
}

export const useAdminCreateRegion = () => {
  const path = `/admin/regions`

  return useMutation((payload: AdminPostRegionsReq) =>
    medusaRequest<AdminRegionsRes>("POST", path, payload)
  )
}
