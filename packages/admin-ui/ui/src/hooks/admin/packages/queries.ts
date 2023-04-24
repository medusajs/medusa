import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"
import { Package } from "./mutations"

const PACKAGE_QUERY_KEY = `package,count` as const

export const packageKeys = queryKeysFactory(PACKAGE_QUERY_KEY)

type PackagesQueryKeys = typeof packageKeys

export class AdminGetVendorPackagesParameter {
  offset = 0
  limit = 50
  expand?: string
  fields?: string
}

export interface AdminVendorPackageRes {
  email: string
  role: string
  access_level: string
}

export const useAdminVendorPackages = (
  vendor_id,
  query?: AdminGetVendorPackagesParameter,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ packages: Package[] }>,
    Error,
    ReturnType<PackagesQueryKeys["list"]>
  >
) => {
  const path = `/admin/vendors/${vendor_id}/packages`

  const { data, refetch, ...rest } = useQuery(
    packageKeys.list({ vendor_id, ...query }),
    () => medusaRequest<Response<{ packages: Package[] }>>("GET", path),
    options
  )

  return { packages: data?.data?.packages, ...rest, refetch } as const
}
