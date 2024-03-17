import {
  AdminShippingProfilesListRes,
  AdminShippingProfilesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_COLLECTIONS_QUERY_KEY = `admin_shippingProfiles` as const

export const adminShippingProfileKeys = queryKeysFactory(
  ADMIN_COLLECTIONS_QUERY_KEY
)

type ShippingProfileQueryKeys = typeof adminShippingProfileKeys

/**
 * This hook retrieves a list of shipping profiles.
 *
 * @example
 * import React from "react"
 * import { useAdminShippingProfiles } from "medusa-react"
 *
 * const ShippingProfiles = () => {
 *   const {
 *     shipping_profiles,
 *     isLoading
 *   } = useAdminShippingProfiles()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {shipping_profiles && !shipping_profiles.length && (
 *         <span>No Shipping Profiles</span>
 *       )}
 *       {shipping_profiles && shipping_profiles.length > 0 && (
 *         <ul>
 *           {shipping_profiles.map((profile) => (
 *             <li key={profile.id}>{profile.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ShippingProfiles
 *
 * @customNamespace Hooks.Admin.Shipping Profiles
 * @category Queries
 */
export const useAdminShippingProfiles = (
  options?: UseQueryOptionsWrapper<
    Response<AdminShippingProfilesListRes>,
    Error,
    ReturnType<ShippingProfileQueryKeys["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminShippingProfileKeys.lists(),
    queryFn: () => client.admin.shippingProfiles.list(),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a shipping profile's details.
 *
 * @example
 * import React from "react"
 * import { useAdminShippingProfile } from "medusa-react"
 *
 * type Props = {
 *   shippingProfileId: string
 * }
 *
 * const ShippingProfile = ({ shippingProfileId }: Props) => {
 *   const {
 *     shipping_profile,
 *     isLoading
 *   } = useAdminShippingProfile(
 *     shippingProfileId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {shipping_profile && (
 *         <span>{shipping_profile.name}</span>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ShippingProfile
 *
 * @customNamespace Hooks.Admin.Shipping Profiles
 * @category Queries
 */
export const useAdminShippingProfile = (
  /**
   * The shipping option's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminShippingProfilesRes>,
    Error,
    ReturnType<ShippingProfileQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminShippingProfileKeys.detail(id),
    queryFn: () => client.admin.shippingProfiles.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
