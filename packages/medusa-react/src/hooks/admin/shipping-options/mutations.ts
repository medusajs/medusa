import {
  AdminPostShippingOptionsOptionReq,
  AdminPostShippingOptionsReq,
  AdminShippingOptionsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminShippingOptionKeys } from "./queries"

/**
 * This hook creates a shipping option.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateShippingOption } from "medusa-react"
 *
 * type CreateShippingOption = {
 *   name: string
 *   provider_id: string
 *   data: Record<string, unknown>
 *   price_type: string
 *   amount: number
 * }
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({ regionId }: Props) => {
 *   const createShippingOption = useAdminCreateShippingOption()
 *   // ...
 *
 *   const handleCreate = (
 *     data: CreateShippingOption
 *   ) => {
 *     createShippingOption.mutate({
 *       ...data,
 *       region_id: regionId
 *     }, {
 *       onSuccess: ({ shipping_option }) => {
 *         console.log(shipping_option.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Shipping Options
 * @category Mutations
 */
export const useAdminCreateShippingOption = (
  options?: UseMutationOptions<
    Response<AdminShippingOptionsRes>,
    Error,
    AdminPostShippingOptionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostShippingOptionsReq) =>
      client.admin.shippingOptions.create(payload),
    ...buildOptions(queryClient, adminShippingOptionKeys.lists(), options),
  })
}

/**
 * This hook updates a shipping option's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateShippingOption } from "medusa-react"
 *
 * type Props = {
 *   shippingOptionId: string
 * }
 *
 * const ShippingOption = ({ shippingOptionId }: Props) => {
 *   const updateShippingOption = useAdminUpdateShippingOption(
 *     shippingOptionId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     name: string,
 *     requirements: {
 *       id: string,
 *       type: string,
 *       amount: number
 *     }[]
 *   ) => {
 *     updateShippingOption.mutate({
 *       name,
 *       requirements
 *     }, {
 *       onSuccess: ({ shipping_option }) => {
 *         console.log(shipping_option.requirements)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ShippingOption
 *
 * @customNamespace Hooks.Admin.Shipping Options
 * @category Mutations
 */
export const useAdminUpdateShippingOption = (
  /**
   * The shipping option's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminShippingOptionsRes>,
    Error,
    AdminPostShippingOptionsOptionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostShippingOptionsOptionReq) =>
      client.admin.shippingOptions.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminShippingOptionKeys.lists(), adminShippingOptionKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a shipping option. Once deleted, it can't be used when creating orders or returns.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteShippingOption } from "medusa-react"
 *
 * type Props = {
 *   shippingOptionId: string
 * }
 *
 * const ShippingOption = ({ shippingOptionId }: Props) => {
 *   const deleteShippingOption = useAdminDeleteShippingOption(
 *     shippingOptionId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteShippingOption.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ShippingOption
 *
 * @customNamespace Hooks.Admin.Shipping Options
 * @category Mutations
 */
export const useAdminDeleteShippingOption = (
  /**
   * The shipping option's ID.
   */
  id: string,
  options?: UseMutationOptions
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.shippingOptions.delete(id),
    ...buildOptions(
      queryClient,
      [adminShippingOptionKeys.lists(), adminShippingOptionKeys.detail(id)],
      options
    ),
  })
}
