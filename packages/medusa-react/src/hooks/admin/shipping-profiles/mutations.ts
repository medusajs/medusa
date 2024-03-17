import {
  AdminDeleteShippingProfileRes,
  AdminPostShippingProfilesProfileReq,
  AdminPostShippingProfilesReq,
  AdminShippingProfilesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminShippingProfileKeys } from "./queries"

/**
 * This hook creates a shipping profile.
 *
 * @example
 * import React from "react"
 * import { ShippingProfileType } from "@medusajs/medusa"
 * import { useAdminCreateShippingProfile } from "medusa-react"
 *
 * const CreateShippingProfile = () => {
 *   const createShippingProfile = useAdminCreateShippingProfile()
 *   // ...
 *
 *   const handleCreate = (
 *     name: string,
 *     type: ShippingProfileType
 *   ) => {
 *     createShippingProfile.mutate({
 *       name,
 *       type
 *     }, {
 *       onSuccess: ({ shipping_profile }) => {
 *         console.log(shipping_profile.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateShippingProfile
 *
 * @customNamespace Hooks.Admin.Shipping Profiles
 * @category Mutations
 */
export const useAdminCreateShippingProfile = (
  options?: UseMutationOptions<
    Response<AdminShippingProfilesRes>,
    Error,
    AdminPostShippingProfilesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostShippingProfilesReq) =>
      client.admin.shippingProfiles.create(payload),
    ...buildOptions(queryClient, adminShippingProfileKeys.lists(), options),
  })
}

/**
 * This hook updates a shipping profile's details.
 *
 * @example
 * import React from "react"
 * import { ShippingProfileType } from "@medusajs/medusa"
 * import { useAdminUpdateShippingProfile } from "medusa-react"
 *
 * type Props = {
 *   shippingProfileId: string
 * }
 *
 * const ShippingProfile = ({ shippingProfileId }: Props) => {
 *   const updateShippingProfile = useAdminUpdateShippingProfile(
 *     shippingProfileId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     name: string,
 *     type: ShippingProfileType
 *   ) => {
 *     updateShippingProfile.mutate({
 *       name,
 *       type
 *     }, {
 *       onSuccess: ({ shipping_profile }) => {
 *         console.log(shipping_profile.name)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ShippingProfile
 *
 * @customNamespace Hooks.Admin.Shipping Profiles
 * @category Mutations
 */
export const useAdminUpdateShippingProfile = (
  /**
   * The shipping profile's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminShippingProfilesRes>,
    Error,
    AdminPostShippingProfilesProfileReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostShippingProfilesProfileReq) =>
      client.admin.shippingProfiles.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminShippingProfileKeys.lists(), adminShippingProfileKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a shipping profile. Associated shipping options are deleted as well.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteShippingProfile } from "medusa-react"
 *
 * type Props = {
 *   shippingProfileId: string
 * }
 *
 * const ShippingProfile = ({ shippingProfileId }: Props) => {
 *   const deleteShippingProfile = useAdminDeleteShippingProfile(
 *     shippingProfileId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteShippingProfile.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ShippingProfile
 *
 * @customNamespace Hooks.Admin.Shipping Profiles
 * @category Mutations
 */
export const useAdminDeleteShippingProfile = (
  /**
   * The shipping profile's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminDeleteShippingProfileRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.shippingProfiles.delete(id),
    ...buildOptions(
      queryClient,
      [adminShippingProfileKeys.lists(), adminShippingProfileKeys.detail(id)],
      options
    ),
  })
}
