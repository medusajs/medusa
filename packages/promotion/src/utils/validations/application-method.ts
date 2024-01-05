import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
} from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  MedusaError,
  isDefined,
} from "@medusajs/utils"

export const allowedAllocationTargetTypes: string[] = [
  ApplicationMethodTargetType.SHIPPING,
  ApplicationMethodTargetType.ITEM,
]

export const allowedAllocationTypes: string[] = [
  ApplicationMethodAllocation.ACROSS,
  ApplicationMethodAllocation.EACH,
]

export const allowedAllocationForQuantity: string[] = [
  ApplicationMethodAllocation.EACH,
]

export function validateApplicationMethodAttributes(data: {
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  max_quantity?: number | null
}) {
  const allTargetTypes: string[] = Object.values(ApplicationMethodTargetType)

  if (!allTargetTypes.includes(data.target_type)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.target_type should be one of ${allTargetTypes.join(
        ", "
      )}`
    )
  }

  const allTypes: string[] = Object.values(ApplicationMethodType)

  if (!allTypes.includes(data.type)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.type should be one of ${allTypes.join(", ")}`
    )
  }

  if (
    allowedAllocationTargetTypes.includes(data.target_type) &&
    !allowedAllocationTypes.includes(data.allocation || "")
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

  if (data.allocation && !allAllocationTypes.includes(data.allocation)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.allocation should be one of ${allAllocationTypes.join(
        ", "
      )}`
    )
  }

  if (
    data.allocation &&
    allowedAllocationForQuantity.includes(data.allocation) &&
    !isDefined(data.max_quantity)
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.max_quantity is required when application_method.allocation is '${allowedAllocationForQuantity.join(
        " OR "
      )}'`
    )
  }
}
