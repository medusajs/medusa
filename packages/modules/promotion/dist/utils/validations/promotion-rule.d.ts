import { PromotionRuleDTO } from "@medusajs/types";
import { CreatePromotionRuleDTO } from "../../types";
export declare function validatePromotionRuleAttributes(promotionRulesData: CreatePromotionRuleDTO[]): void;
export declare function areRulesValidForContext(rules: PromotionRuleDTO[], context: Record<string, any>): boolean;
export declare function evaluateRuleValueCondition(ruleValues: string[], operator: string, ruleValuesToCheck: string[] | string): boolean;
//# sourceMappingURL=promotion-rule.d.ts.map