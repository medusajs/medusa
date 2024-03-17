import {
  AdminGetShippingOptionsParams,
  AdminShippingOptionsListRes,
  AdminShippingOptionsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_SHIPPING_OPTIONS_QUERY_KEY = `admin_shipping_options` as const

export const adminShippingOptionKeys = queryKeysFactory(
  ADMIN_SHIPPING_OPTIONS_QUERY_KEY
)

type ShippingOptionQueryKeys = typeof adminShippingOptionKeys

/**
 * This hook retrieves a list of shipping options. The shipping options can be filtered by fields such as `region_id`
 * or `is_return` passed in the `query` parameter.
 *
 * @example
 * import React from "react"
 * import { useAdminShippingOptions } from "medusa-react"
 *
 * const ShippingOptions = () => {
 *   const {
 *     shipping_options,
 *     isLoading
 *   } = useAdminShippingOptions()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {shipping_options && !shipping_options.length && (
 *         <span>No Shipping Options</span>
 *       )}
 *       {shipping_options && shipping_options.length > 0 && (
 *         <ul>
 *           {shipping_options.map((option) => (
 *             <li key={option.id}>{option.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ShippingOptions
 *
 * @customNamespace Hooks.Admin.Shipping Options
 * @category Queries
 */
export const useAdminShippingOptions = (
  /**
   * Filters to apply on the retrieved shipping options.
   */
  query?: AdminGetShippingOptionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminShippingOptionsListRes>,
    Error,
    ReturnType<ShippingOptionQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminShippingOptionKeys.list(query),
    queryFn: () => client.admin.shippingOptions.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a shipping option's details.
 *
 * @example
 * import React from "react"
 * import { useAdminShippingOption } from "medusa-react"
 *
 * type Props = {
 *   shippingOptionId: string
 * }
 *
 * const ShippingOption = ({ shippingOptionId }: Props) => {
 *   const {
 *     shipping_option,
 *     isLoading
 *   } = useAdminShippingOption(
 *     shippingOptionId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {shipping_option && <span>{shipping_option.name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default ShippingOption
 *
 * @customNamespace Hooks.Admin.Shipping Options
 * @category Queries
 */
export const useAdminShippingOption = (
  /**
   * The shipping option's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminShippingOptionsRes>,
    Error,
    ReturnType<ShippingOptionQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminShippingOptionKeys.detail(id),
    queryFn: () => client.admin.shippingOptions.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
