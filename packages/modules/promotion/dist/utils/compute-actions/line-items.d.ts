import { ApplicationMethodAllocationValues, PromotionTypes } from "@medusajs/types";
import { ApplicationMethodTargetType as TargetType } from "@medusajs/utils";
export declare function getComputedActionsForItems(promotion: PromotionTypes.PromotionDTO, items: PromotionTypes.ComputeActionContext[TargetType.ITEMS], appliedPromotionsMap: Map<string, number>, allocationOverride?: ApplicationMethodAllocationValues): PromotionTypes.ComputeActions[];
export declare function getComputedActionsForShippingMethods(promotion: PromotionTypes.PromotionDTO, shippingMethods: PromotionTypes.ComputeActionContext[TargetType.SHIPPING_METHODS], appliedPromotionsMap: Map<string, number>): PromotionTypes.ComputeActions[];
export declare function getComputedActionsForOrder(promotion: PromotionTypes.PromotionDTO, itemApplicationContext: PromotionTypes.ComputeActionContext, methodIdPromoValueMap: Map<string, number>): PromotionTypes.ComputeActions[];
//# sourceMappingURL=line-items.d.ts.map