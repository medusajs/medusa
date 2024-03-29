import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  isDefined,
  isPresent,
  MedusaError,
  PromotionType,
} from "@medusajs/utils"
import { Promotion } from "@models"
import { CreateApplicationMethodDTO, UpdateApplicationMethodDTO } from "@types"

export const allowedAllocationTargetTypes: string[] = [
  ApplicationMethodTargetType.SHIPPING_METHODS,
  ApplicationMethodTargetType.ITEMS,
]

export const allowedAllocationTypes: string[] = [
  ApplicationMethodAllocation.ACROSS,
  ApplicationMethodAllocation.EACH,
]

export const allowedAllocationForQuantity: string[] = [
  ApplicationMethodAllocation.EACH,
]

export function validateApplicationMethodAttributes(
  data: UpdateApplicationMethodDTO | CreateApplicationMethodDTO,
  promotion: Promotion
) {
  const applicationMethod = promotion?.application_method || {}
  const buyRulesMinQuantity =
    data.buy_rules_min_quantity || applicationMethod?.buy_rules_min_quantity
  const applyToQuantity =
    data.apply_to_quantity || applicationMethod?.apply_to_quantity
  const targetType = data.target_type || applicationMethod?.target_type
  const type = data.type || applicationMethod?.type
  const applicationMethodType = data.type || applicationMethod?.type
  const value = data.value || applicationMethod.value
  const maxQuantity = data.max_quantity || applicationMethod.max_quantity
  const allocation = data.allocation || applicationMethod.allocation
  const allTargetTypes: string[] = Object.values(ApplicationMethodTargetType)

  if (
    type === ApplicationMethodType.PERCENTAGE &&
    (typeof value !== "number" || value <= 0 || value > 100)
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Application Method value should be a percentage number between 0 and 100`
    )
  }

  if (promotion?.type === PromotionType.BUYGET) {
    if (!isPresent(applyToQuantity)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `apply_to_quantity is a required field for Promotion type of ${PromotionType.BUYGET}`
      )
    }

    if (!isPresent(buyRulesMinQuantity)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `buy_rules_min_quantity is a required field for Promotion type of ${PromotionType.BUYGET}`
      )
    }
  }

  if (
    allocation === ApplicationMethodAllocation.ACROSS &&
    isPresent(maxQuantity)
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.max_quantity is not allowed to be set for allocation (${ApplicationMethodAllocation.ACROSS})`
    )
  }

  if (!allTargetTypes.includes(targetType)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.target_type should be one of ${allTargetTypes.join(
        ", "
      )}`
    )
  }

  const allTypes: string[] = Object.values(ApplicationMethodType)

  if (!allTypes.includes(applicationMethodType)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.type should be one of ${allTypes.join(", ")}`
    )
  }

  if (
    allowedAllocationTargetTypes.includes(targetType) &&
    !allowedAllocationTypes.includes(allocation || "")
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.allocation should be either '${allowedAllocationTypes.join(
        " OR "
      )}' when application_method.target_type is either '${allowedAllocationTargetTypes.join(
        " OR "
      )}'`
    )
  }

  const allAllocationTypes: string[] = Object.values(
    ApplicationMethodAllocation
  )

  if (allocation && !allAllocationTypes.includes(allocation)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.allocation should be one of ${allAllocationTypes.join(
        ", "
      )}`
    )
  }

  if (
    allocation &&
    allowedAllocationForQuantity.includes(allocation) &&
    !isDefined(maxQuantity)
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.max_quantity is required when application_method.allocation is '${allowedAllocationForQuantity.join(
        " OR "
      )}'`
    )
  }
}
