import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  MedusaError,
  isDefined,
} from "@medusajs/utils"
import { CreateApplicationMethodDTO } from "../../types"

const allowedTargetTypes: string[] = [
  ApplicationMethodTargetType.SHIPPING,
  ApplicationMethodTargetType.ITEM,
]

const allowedAllocationTypes: string[] = [
  ApplicationMethodAllocation.ACROSS,
  ApplicationMethodAllocation.EACH,
]

const allowedAllocationForQuantity: string[] = [
  ApplicationMethodAllocation.EACH,
]

export function validateApplicationMethodAttributes(
  data: CreateApplicationMethodDTO
) {
  if (
    allowedTargetTypes.includes(data.target_type) &&
    !allowedAllocationTypes.includes(data.allocation || "")
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `application_method.allocation should be either '${allowedAllocationTypes.join(
        " OR "
      )}' when application_method.target_type is either '${allowedTargetTypes.join(
        " OR "
      )}'`
    )
  }

  if (
    allowedAllocationForQuantity.includes(data.allocation || "") &&
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
