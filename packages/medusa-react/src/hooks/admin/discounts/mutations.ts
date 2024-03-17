import {
  AdminDeleteDiscountsDiscountConditionsConditionBatchReq,
  AdminDiscountsDeleteRes,
  AdminDiscountsRes,
  AdminPostDiscountsDiscountConditions,
  AdminPostDiscountsDiscountConditionsCondition,
  AdminPostDiscountsDiscountConditionsConditionBatchParams,
  AdminPostDiscountsDiscountConditionsConditionBatchReq,
  AdminPostDiscountsDiscountDynamicCodesReq,
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminDiscountKeys } from "./queries"

/**
 * This hook adds a batch of resources to a discount condition. The type of resource depends on the type of discount condition.
 * For example, if the discount condition's type is `products`, the resources being added should be products.
 *
 * @example
 * To add resources to a discount condition:
 *
 * ```tsx
 * import React from "react"
 * import {
 *   useAdminAddDiscountConditionResourceBatch
 * } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 *   conditionId: string
 * }
 *
 * const DiscountCondition = ({
 *   discountId,
 *   conditionId
 * }: Props) => {
 *   const addConditionResources = useAdminAddDiscountConditionResourceBatch(
 *     discountId,
 *     conditionId
 *   )
 *   // ...
 *
 *   const handleAdd = (itemId: string) => {
 *     addConditionResources.mutate({
 *       resources: [
 *         {
 *           id: itemId
 *         }
 *       ]
 *     }, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DiscountCondition
 * ```
 *
 * To specify relations to include in the returned discount:
 *
 * ```tsx
 * import React from "react"
 * import {
 *   useAdminAddDiscountConditionResourceBatch
 * } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 *   conditionId: string
 * }
 *
 * const DiscountCondition = ({
 *   discountId,
 *   conditionId
 * }: Props) => {
 *   const addConditionResources = useAdminAddDiscountConditionResourceBatch(
 *     discountId,
 *     conditionId,
 *     {
 *       expand: "rule"
 *     }
 *   )
 *   // ...
 *
 *   const handleAdd = (itemId: string) => {
 *     addConditionResources.mutate({
 *       resources: [
 *         {
 *           id: itemId
 *         }
 *       ]
 *     }, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DiscountCondition
 * ```
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminAddDiscountConditionResourceBatch = (
  /**
   * The ID of the discount the condition belongs to.
   */
  discountId: string,
  /**
   * The discount condition's ID.
   */
  conditionId: string,
  /**
   * Configurations to apply on the retrieved discount.
   */
  query?: AdminPostDiscountsDiscountConditionsConditionBatchParams,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountConditionsConditionBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      payload: AdminPostDiscountsDiscountConditionsConditionBatchReq
    ) =>
      client.admin.discounts.addConditionResourceBatch(
        discountId,
        conditionId,
        payload,
        query
      ),
    ...buildOptions(queryClient, adminDiscountKeys.detail(discountId), options),
  })
}

/**
 * This hook remove a batch of resources from a discount condition. This will only remove the association between the resource and
 * the discount condition, not the resource itself.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminDeleteDiscountConditionResourceBatch
 * } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 *   conditionId: string
 * }
 *
 * const DiscountCondition = ({
 *   discountId,
 *   conditionId
 * }: Props) => {
 *   const deleteConditionResource = useAdminDeleteDiscountConditionResourceBatch(
 *     discountId,
 *     conditionId,
 *   )
 *   // ...
 *
 *   const handleDelete = (itemId: string) => {
 *     deleteConditionResource.mutate({
 *       resources: [
 *         {
 *           id: itemId
 *         }
 *       ]
 *     }, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DiscountCondition
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminDeleteDiscountConditionResourceBatch = (
  /**
   * The ID of the discount the condition belongs to.
   */
  discountId: string,
  /**
   * The discount condition's ID.
   */
  conditionId: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminDeleteDiscountsDiscountConditionsConditionBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      payload: AdminDeleteDiscountsDiscountConditionsConditionBatchReq
    ) =>
      client.admin.discounts.deleteConditionResourceBatch(
        discountId,
        conditionId,
        payload
      ),
    ...buildOptions(
      queryClient,
      [adminDiscountKeys.detail(discountId)],
      options
    ),
  })
}

/**
 * This hook creates a discount with a given set of rules that defines how the discount is applied.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminCreateDiscount,
 * } from "medusa-react"
 * import {
 *   AllocationType,
 *   DiscountRuleType,
 * } from "@medusajs/medusa"
 *
 * const CreateDiscount = () => {
 *   const createDiscount = useAdminCreateDiscount()
 *   // ...
 *
 *   const handleCreate = (
 *     currencyCode: string,
 *     regionId: string
 *   ) => {
 *     // ...
 *     createDiscount.mutate({
 *       code: currencyCode,
 *       rule: {
 *         type: DiscountRuleType.FIXED,
 *         value: 10,
 *         allocation: AllocationType.ITEM,
 *       },
 *       regions: [
 *           regionId,
 *       ],
 *       is_dynamic: false,
 *       is_disabled: false,
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateDiscount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminCreateDiscount = (
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostDiscountsReq) =>
      client.admin.discounts.create(payload),
    ...buildOptions(queryClient, adminDiscountKeys.lists(), options),
  })
}

/**
 * This hook updates a discount with a given set of rules that define how the discount is applied.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateDiscount } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 * }
 *
 * const Discount = ({ discountId }: Props) => {
 *   const updateDiscount = useAdminUpdateDiscount(discountId)
 *   // ...
 *
 *   const handleUpdate = (isDisabled: boolean) => {
 *     updateDiscount.mutate({
 *       is_disabled: isDisabled,
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminUpdateDiscount = (
  /**
   * The discount's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostDiscountsDiscountReq) =>
      client.admin.discounts.update(id, payload),
    ...buildOptions(queryClient, adminDiscountKeys.detail(id), options),
  })
}

/**
 * This hook deletes a discount. Deleting the discount will make it unavailable for customers to use.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteDiscount } from "medusa-react"
 *
 * const Discount = () => {
 *   const deleteDiscount = useAdminDeleteDiscount(discount_id)
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteDiscount.mutate()
 *   }
 *
 *   // ...
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminDeleteDiscount = (
  /**
   * The discount's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminDiscountsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => client.admin.discounts.delete(id),
    ...buildOptions(queryClient, adminDiscountKeys.lists(), options),
  })
}

/**
 * This hook adds a Region to the list of Regions a Discount can be used in.
 *
 * @typeParamDefinition string - The ID of the region to add.
 *
 * @example
 * import React from "react"
 * import { useAdminDiscountAddRegion } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 * }
 *
 * const Discount = ({ discountId }: Props) => {
 *   const addRegion = useAdminDiscountAddRegion(discountId)
 *   // ...
 *
 *   const handleAdd = (regionId: string) => {
 *     addRegion.mutate(regionId, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.regions)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminDiscountAddRegion = (
  /**
   * The discount's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminDiscountsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (regionId: string) =>
      client.admin.discounts.addRegion(id, regionId),
    ...buildOptions(queryClient, adminDiscountKeys.detail(id), options),
  })
}

/**
 * This hook removes a Region from the list of Regions that a Discount can be used in.
 * This does not delete a region, only the association between it and the discount.
 *
 * @typeParamDefinition string - The ID of the region to remove.
 *
 * @example
 * import React from "react"
 * import { useAdminDiscountRemoveRegion } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 * }
 *
 * const Discount = ({ discountId }: Props) => {
 *   const deleteRegion = useAdminDiscountRemoveRegion(discountId)
 *   // ...
 *
 *   const handleDelete = (regionId: string) => {
 *     deleteRegion.mutate(regionId, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.regions)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminDiscountRemoveRegion = (
  /**
   * The discount's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminDiscountsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (regionId: string) =>
      client.admin.discounts.removeRegion(id, regionId),
    ...buildOptions(queryClient, adminDiscountKeys.detail(id), options),
  })
}

/**
 * This hook creates a dynamic unique code that can map to a parent discount. This is useful if you want to
 * automatically generate codes with the same rules and conditions.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateDynamicDiscountCode } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 * }
 *
 * const Discount = ({ discountId }: Props) => {
 *   const createDynamicDiscount = useAdminCreateDynamicDiscountCode(discountId)
 *   // ...
 *
 *   const handleCreate = (
 *     code: string,
 *     usageLimit: number
 *   ) => {
 *     createDynamicDiscount.mutate({
 *       code,
 *       usage_limit: usageLimit
 *     }, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.is_dynamic)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminCreateDynamicDiscountCode = (
  /**
   * The discount's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountDynamicCodesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostDiscountsDiscountDynamicCodesReq) =>
      client.admin.discounts.createDynamicCode(id, payload),
    ...buildOptions(
      queryClient,
      [adminDiscountKeys.lists(), adminDiscountKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a dynamic code from a discount.
 *
 * @typeParamDefinition string - The code of the dynamic discount to delete.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteDynamicDiscountCode } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 * }
 *
 * const Discount = ({ discountId }: Props) => {
 *   const deleteDynamicDiscount = useAdminDeleteDynamicDiscountCode(discountId)
 *   // ...
 *
 *   const handleDelete = (code: string) => {
 *     deleteDynamicDiscount.mutate(code, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.is_dynamic)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminDeleteDynamicDiscountCode = (
  /**
   * The discount's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminDiscountsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code: string) =>
      client.admin.discounts.deleteDynamicCode(id, code),
    ...buildOptions(
      queryClient,
      [adminDiscountKeys.lists(), adminDiscountKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook creates a discount condition. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups`
 * should be provided in the `payload` parameter, based on the type of discount condition. For example, if the discount condition's type is `products`,
 * the `products` field should be provided in the `payload` parameter.
 *
 * @example
 * import React from "react"
 * import { DiscountConditionOperator } from "@medusajs/medusa"
 * import { useAdminDiscountCreateCondition } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 * }
 *
 * const Discount = ({ discountId }: Props) => {
 *   const createCondition = useAdminDiscountCreateCondition(discountId)
 *   // ...
 *
 *   const handleCreateCondition = (
 *     operator: DiscountConditionOperator,
 *     products: string[]
 *   ) => {
 *     createCondition.mutate({
 *       operator,
 *       products
 *     }, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminDiscountCreateCondition = (
  /**
   * The discount's ID.
   */
  discountId: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountConditions
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostDiscountsDiscountConditions) =>
      client.admin.discounts.createCondition(discountId, payload),
    ...buildOptions(queryClient, adminDiscountKeys.detail(discountId), options),
  })
}

/**
 * Update a discount condition. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups`
 * should be provided in the `payload` parameter, based on the type of discount condition. For example, if the discount condition's
 * type is `products`, the `products` field should be provided in the `payload` parameter.
 *
 * @example
 * import React from "react"
 * import { useAdminDiscountUpdateCondition } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 *   conditionId: string
 * }
 *
 * const DiscountCondition = ({
 *   discountId,
 *   conditionId
 * }: Props) => {
 *   const update = useAdminDiscountUpdateCondition(
 *     discountId,
 *     conditionId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     products: string[]
 *   ) => {
 *     update.mutate({
 *       products
 *     }, {
 *       onSuccess: ({ discount }) => {
 *         console.log(discount.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DiscountCondition
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminDiscountUpdateCondition = (
  /**
   * The discount's ID.
   */
  discountId: string,
  /**
   * The discount condition's ID.
   */
  conditionId: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountConditionsCondition
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostDiscountsDiscountConditionsCondition) =>
      client.admin.discounts.updateCondition(discountId, conditionId, payload),
    ...buildOptions(queryClient, adminDiscountKeys.detail(discountId), options),
  })
}

/**
 * This hook deletes a discount condition. This doesn't delete resources associated to the discount condition.
 *
 * @typeParamDefinition string - The ID of the condition to delete.
 *
 * @example
 * import React from "react"
 * import { useAdminDiscountRemoveCondition } from "medusa-react"
 *
 * type Props = {
 *   discountId: string
 * }
 *
 * const Discount = ({ discountId }: Props) => {
 *   const deleteCondition = useAdminDiscountRemoveCondition(
 *     discountId
 *   )
 *   // ...
 *
 *   const handleDelete = (
 *     conditionId: string
 *   ) => {
 *     deleteCondition.mutate(conditionId, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(deleted)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Discount
 *
 * @customNamespace Hooks.Admin.Discounts
 * @category Mutations
 */
export const useAdminDiscountRemoveCondition = (
  /**
   * The discount's ID.
   */
  discountId: string,
  options?: UseMutationOptions<Response<AdminDiscountsDeleteRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (conditionId: string) =>
      client.admin.discounts.deleteCondition(discountId, conditionId),
    ...buildOptions(queryClient, adminDiscountKeys.detail(discountId), options),
  })
}
