import {
  AdminGetVariantParams,
  AdminGetVariantsParams,
  AdminGetVariantsVariantInventoryRes,
  AdminVariantsListRes,
  AdminVariantsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_VARIANT_QUERY_KEY = `admin_variants` as const

export const adminVariantKeys = queryKeysFactory(ADMIN_VARIANT_QUERY_KEY)

type VariantQueryKeys = typeof adminVariantKeys

/**
 * This hook retrieves a list of product variants. The product variant can be filtered by fields such as `id` or `title`
 * passed in the `query` parameter. The product variant can also be paginated.
 *
 * @example
 * To list product variants:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminVariants } from "medusa-react"
 *
 * const Variants = () => {
 *   const { variants, isLoading } = useAdminVariants()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {variants && !variants.length && (
 *         <span>No Variants</span>
 *       )}
 *       {variants && variants.length > 0 && (
 *         <ul>
 *           {variants.map((variant) => (
 *             <li key={variant.id}>{variant.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Variants
 * ```
 *
 * To specify relations that should be retrieved within the product variants:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminVariants } from "medusa-react"
 *
 * const Variants = () => {
 *   const { variants, isLoading } = useAdminVariants({
 *     expand: "options"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {variants && !variants.length && (
 *         <span>No Variants</span>
 *       )}
 *       {variants && variants.length > 0 && (
 *         <ul>
 *           {variants.map((variant) => (
 *             <li key={variant.id}>{variant.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Variants
 * ```
 *
 * By default, only the first `100` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminVariants } from "medusa-react"
 *
 * const Variants = () => {
 *   const {
 *     variants,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminVariants({
 *     expand: "options",
 *     limit: 50,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {variants && !variants.length && (
 *         <span>No Variants</span>
 *       )}
 *       {variants && variants.length > 0 && (
 *         <ul>
 *           {variants.map((variant) => (
 *             <li key={variant.id}>{variant.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Variants
 * ```
 *
 * @customNamespace Hooks.Admin.Product Variants
 * @category Queries
 */
export const useAdminVariants = (
  /**
   * Filters and pagination configurations to apply on the retrieved product variants.
   */
  query?: AdminGetVariantsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminVariantsListRes>,
    Error,
    ReturnType<VariantQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminVariantKeys.list(query),
    queryFn: () => client.admin.variants.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a product variant's details.
 *
 * @example
 * A simple example that retrieves a product variant by its ID:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminVariant } from "medusa-react"
 *
 * type Props = {
 *   variantId: string
 * }
 *
 * const Variant = ({ variantId }: Props) => {
 *   const { variant, isLoading } = useAdminVariant(
 *     variantId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {variant && <span>{variant.title}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Variant
 * ```
 *
 * To specify relations that should be retrieved:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminVariant } from "medusa-react"
 *
 * type Props = {
 *   variantId: string
 * }
 *
 * const Variant = ({ variantId }: Props) => {
 *   const { variant, isLoading } = useAdminVariant(
 *     variantId, {
 *       expand: "options"
 *     }
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {variant && <span>{variant.title}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Variant
 * ```
 *
 * @customNamespace Hooks.Admin.Product Variants
 * @category Queries
 */
export const useAdminVariant = (
  /**
   * The product variant's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved product variant.
   */
  query?: AdminGetVariantParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminVariantsRes>,
    Error,
    ReturnType<VariantQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminVariantKeys.detail(id),
    queryFn: () => client.admin.variants.retrieve(id, query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves the available inventory of a product variant.
 *
 * @example
 * import React from "react"
 * import { useAdminVariantsInventory } from "medusa-react"
 *
 * type Props = {
 *   variantId: string
 * }
 *
 * const VariantInventory = ({ variantId }: Props) => {
 *   const { variant, isLoading } = useAdminVariantsInventory(
 *     variantId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {variant && variant.inventory.length === 0 && (
 *         <span>Variant doesn't have inventory details</span>
 *       )}
 *       {variant && variant.inventory.length > 0 && (
 *         <ul>
 *           {variant.inventory.map((inventory) => (
 *             <li key={inventory.id}>{inventory.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default VariantInventory
 *
 * @customNamespace Hooks.Admin.Product Variants
 * @category Queries
 */
export const useAdminVariantsInventory = (
  /**
   * The product variant's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminGetVariantsVariantInventoryRes>,
    Error,
    ReturnType<VariantQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminVariantKeys.detail(id),
    queryFn: () => client.admin.variants.getInventory(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
