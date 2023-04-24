import { useQuery } from "react-query"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"
import { ShippingProfile } from "@medusajs/medusa"

const ADMIN_SHIPPING_PROFILES_QUERY_KEY = `admin_shipping_options` as const

export const adminShippingProfileKeys = queryKeysFactory(
  ADMIN_SHIPPING_PROFILES_QUERY_KEY
)

export declare class AdminGetShippingProfilesParams {
  vendor_id?: string | null
  type?: "default" | "vendor_default" | "gift_card"
}

export declare class AdminGetShippingProfilesReturn {
  shipping_profiles: ShippingProfile[]
}

type ShippingProfileQueryKeys = typeof adminShippingProfileKeys

export const useAdminShippingProfiles = (
  query?: AdminGetShippingProfilesParams,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<AdminGetShippingProfilesReturn>,
    Error,
    ReturnType<ShippingProfileQueryKeys["list"]>
  >
) => {
  const path = `/admin/shipping-profiles?vendor_id=${query?.vendor_id}&type=${query?.type}`

  const { data, ...rest } = useQuery(
    adminShippingProfileKeys.list(query),
    () => medusaRequest<Response<AdminGetShippingProfilesReturn>>("GET", path),
    options
  )
  return { ...data?.data, ...rest } as const
}
