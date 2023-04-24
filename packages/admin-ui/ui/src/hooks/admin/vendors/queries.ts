import { Vendor } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import queryClient from "../../../services/queryClient"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const VENDOR_QUERY_KEY = `vendor,count` as const

export const vendorKeys = queryKeysFactory(VENDOR_QUERY_KEY)

type VendorQueryKeys = typeof vendorKeys

export class AdminGetVendorsParameter {
  offset = 0
  limit = 50
  expand?: string
  fields?: string
}

export const clearVendorsCache = () => queryClient.clear()

export const useGetVendor = (
  id: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ vendor: Vendor }>,
    Error,
    ReturnType<VendorQueryKeys["detail"]>
  >
) => {
  const path = `/admin/vendors/${id}`

  const { data, refetch, ...rest } = useQuery(
    vendorKeys.detail(id),
    () => medusaRequest<Response<{ vendor: Vendor }>>("GET", path),
    options
  )

  return { vendor: data?.data?.vendor, ...rest, refetch }
}

export const useGetVendors = (
  query?: AdminGetVendorsParameter,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ vendors: Vendor[] }>,
    Error,
    ReturnType<VendorQueryKeys["list"]>
  >
) => {
  const path = `/admin/vendors`

  const { data, refetch, ...rest } = useQuery(
    vendorKeys.list(query),
    () => medusaRequest<Response<{ vendors: Vendor[] }>>("GET", path),
    options
  )

  return { vendors: data?.data.vendors, ...rest, refetch } as const
}

export class AdminGetVendorAccessParameter {
  offset = 0
  limit = 50
  expand?: string
  // QUESTION: Should this be `vendor_id`?
  store_id?: string
  fields?: string
}

export interface AdminVendorAccessRes {
  id: string
  name: string
  email: string
  role: string
  access_level: string
}

export const useAdminVendorAccess = (
  vendor_id,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<AdminVendorAccessRes[]>,
    Error,
    ReturnType<any>
  >
) => {
  const path = `/admin/vendor/access?vendor_id=${vendor_id}`

  const { data, ...rest } = useQuery(
    vendorKeys.list(["/admin/vendor/access", vendor_id]),
    () => medusaRequest<Response<AdminVendorAccessRes[]>>("GET", path),
    options
  )
  return { ...data, ...rest } as const
}
