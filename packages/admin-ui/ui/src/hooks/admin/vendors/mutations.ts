import { Vendor } from "@medusajs/medusa"
import { AdminPostStoreReq } from "@medusajs/medusa/dist/api"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"
import queryClient from "../../../services/queryClient"
import { vendorKeys } from "."
import { buildOptions } from "../../utils/buildOptions"
import { adminStoreKeys } from "medusa-react"

export interface AdminPostStoreReqExtended extends AdminPostStoreReq {
  id?: string
}

export interface AdminPutVendorReq {
  id: string
  name?: string
  handle?: string
  description?: string
  email?: string
  country_code?: string
}

export interface AdminPostVendorReq {
  name: string
  handle?: string
  description?: string
}

export const useAdminUpdateVendor = (vendor_id: string) => {
  const path = `/admin/vendor`

  return useMutation(
    (payload: AdminPutVendorReq) =>
      medusaRequest<{ vendor: Vendor }>("PUT", path, {
        ...payload,
        id: vendor_id,
      }),
    buildOptions(queryClient, [
      vendorKeys.list(),
      vendorKeys.detail(vendor_id),
      adminStoreKeys.details(),
    ])
  )
}

export const useAdminArchiveVendor = () => {
  return useMutation(({ id }: { id: string }) =>
    medusaRequest<{ vendor: Vendor }>("DELETE", `/admin/vendor/${id}`)
  )
}

export const useAdminCreateVendor = () => {
  const path = `/admin/vendor`

  return useMutation(
    (payload: AdminPostVendorReq) =>
      medusaRequest<{ vendor: Vendor }>("POST", path, payload),
    buildOptions(queryClient, [vendorKeys.list()])
  )
}
