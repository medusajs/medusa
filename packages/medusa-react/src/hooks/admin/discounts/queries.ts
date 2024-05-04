import {
  AdminDiscountConditionsRes,
  AdminDiscountsListRes,
  AdminDiscountsRes,
  AdminGetDiscountParams,
  AdminGetDiscountsDiscountConditionsConditionParams,
  AdminGetDiscountsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_DISCOUNTS_QUERY_KEY = `admin_discounts` as const

export const adminDiscountKeys = {
  ...queryKeysFactory(ADMIN_DISCOUNTS_QUERY_KEY),
  detailCondition(id: string, query?: any) {
    return [
      ...this.detail(id),
      "condition" as const,
      { ...(query || {}) },
    ] as const
  },
}

type DiscountQueryKeys = typeof adminDiscountKeys

/**
 * This hook retrieves a list of Discounts. The discounts can be filtered by fields such as `rule` or `is_dynamic`.
 * The discounts can also be paginated.
 *
 * @example
 * To list discounts:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminDiscounts } from "medusa-react"
 *
 * const Discounts = () => {
 *   const { discounts, isLoading } = useAdminDiscounts()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {discounts && !discounts.length && (
 *         <span>No customers</span>
 *       )}
 *       {discounts && discounts.length > 0 && (
 *         <ul>
 *           {discounts.map((discount) => (
 *             <li key={discount.id}>{discount.code}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Discounts
 * ```
 *
 * To specify relations that should be retrieved within the discounts:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminDiscounts } from "medusa-react"
 *
 * const Discounts = () => {
 *   const { discounts, isLoading } = useAdminDiscounts({
 *     expand: "rule"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {discounts && !discounts.length && (
 *         <span>No customers</span>
 *       )}
 *       {discounts && discounts.length > 0 && (
 *         <ul>
 *           {discounts.map((discount) => (
 *             <li key={discount.id}>{discount.code}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Discounts
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminDiscounts } from "medusa-react"
 *
 * const Discounts = () => {
 *   const {
 *     discounts,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminDiscounts({
 *     expand: "rule",
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {discounts && !discounts.length && (
 *         <span>No customers</span>
 *       )}
 *       {discounts && discounts.length > 0 && (
 *         <ul>
 *           {discounts.map((discount) => (
 *             <li key={discount.id}>{discount.code}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Discounts
 * ```
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Queries
 */
export const useAdminDiscounts = (
  /**
   * Filters and pagination configurations to apply on the retrieved discounts.
   */
  query?: AdminGetDiscountsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminDiscountsListRes>,
    Error,
    ReturnType<DiscountQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDiscountKeys.list(query),
    () => client.admin.discounts.list(query),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a discount.
 *
 * @example
 * import React from "react"
 * import { useAdminDiscount } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 * }
 *
 * const Discount = ({ discountId }: Props) => {
 *   const { discount, isLoading } = useAdminDiscount(
 *     discountId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {discount && <span>{discount.code}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Queries
 */
export const useAdminDiscount = (
  /**
   * The discount's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved discount.
   */
  query?: AdminGetDiscountParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminDiscountsRes>,
    Error,
    ReturnType<DiscountQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDiscountKeys.detail(id),
    () => client.admin.discounts.retrieve(id, query),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * This hook adds a batch of resources to a discount condition. The type of resource depends on the type of discount condition. For example, if the discount condition's type is `products`,
 * the resources being added should be products.
 *
 * @example
 * import React from "react"
 * import { useAdminGetDiscountByCode } from "medusa-react"
 *
 * type Props = {
 *   discountCode: string
 * }
 *
 * const Discount = ({ discountCode }: Props) => {
 *   const { discount, isLoading } = useAdminGetDiscountByCode(
 *     discountCode
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {discount && <span>{discount.code}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Queries
 */
export const useAdminGetDiscountByCode = (
  /**
   * The code of the discount.
   */
  code: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminDiscountsRes>,
    Error,
    ReturnType<DiscountQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDiscountKeys.detail(code),
    () => client.admin.discounts.retrieveByCode(code),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * This hook retries a Discount Condition's details.
 *
 * @example
 * import React from "react"
 * import { useAdminGetDiscountCondition } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 *   discountConditionId: string
 * }
 *
 * const DiscountCondition = ({
 *   discountId,
 *   discountConditionId
 * }: Props) => {
 *   const {
 *     discount_condition,
 *     isLoading
 *   } = useAdminGetDiscountCondition(
 *     discountId,
 *     discountConditionId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {discount_condition && (
 *         <span>{discount_condition.type}</span>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default DiscountCondition
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Queries
 */
export const useAdminGetDiscountCondition = (
  /**
   * The ID of the discount the condition belongs to.
   */
  id: string,
  /**
   * The discount condition's ID.
   */
  conditionId: string,
  /**
   * Configurations to apply on the retrieved discount condition.
   */
  query?: AdminGetDiscountsDiscountConditionsConditionParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminDiscountConditionsRes>,
    Error,
    ReturnType<DiscountQueryKeys["detailCondition"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDiscountKeys.detailCondition(conditionId),
    () => client.admin.discounts.getCondition(id, conditionId, query),
    options
  )
  return { ...data, ...rest } as const
}
