import { PromotionTypes } from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
} from "@medusajs/utils"
import { getComputedActionsForItems } from "./items"

export function getComputedActionsForOrder(
  promotion: PromotionTypes.PromotionDTO,
  itemApplicationContext: PromotionTypes.ComputeActionContext,
  itemIdPromoValueMap: Map<string, number>
): PromotionTypes.ComputeActions[] {
  return getComputedActionsForItems(
    promotion,
    itemApplicationContext[ApplicationMethodTargetType.ITEMS],
    itemIdPromoValueMap,
    ApplicationMethodAllocation.ACROSS
  )
}
