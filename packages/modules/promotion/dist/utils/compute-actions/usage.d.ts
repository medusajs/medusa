import { CampaignBudgetExceededAction, ComputeActions, PromotionDTO } from "@medusajs/types";
export declare function canRegisterUsage(computedAction: ComputeActions): boolean;
export declare function computeActionForBudgetExceeded(promotion: PromotionDTO, amount: number): CampaignBudgetExceededAction | void;
//# sourceMappingURL=usage.d.ts.map