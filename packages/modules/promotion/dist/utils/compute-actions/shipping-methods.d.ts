import { PromotionTypes } from "@medusajs/types";
import { ApplicationMethodTargetType } from "@medusajs/utils";
export declare function getComputedActionsForShippingMethods(promotion: PromotionTypes.PromotionDTO, shippingMethodApplicationContext: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.SHIPPING_METHODS], methodIdPromoValueMap: Map<string, number>): PromotionTypes.ComputeActions[];
export declare function applyPromotionToShippingMethods(promotion: PromotionTypes.PromotionDTO, shippingMethods: PromotionTypes.ComputeActionContext[ApplicationMethodTargetType.SHIPPING_METHODS], methodIdPromoValueMap: Map<string, number>): PromotionTypes.ComputeActions[];
//# sourceMappingURL=shipping-methods.d.ts.map