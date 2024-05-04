import { BaseFilterable } from "../../dal";
import { PromotionRuleValueDTO } from "./promotion-rule-value";
/**
 * The possible operators to use in a promotion rule.
 */
export type PromotionRuleOperatorValues = "gt" | "lt" | "eq" | "ne" | "in" | "lte" | "gte";
/**
 * The promotion rule details.
 */
export interface PromotionRuleDTO {
    /**
     * The ID of the promotion rule.
     */
    id: string;
    /**
     * The description of the promotion rule.
     */
    description?: string | null;
    /**
     * The attribute of the promotion rule.
     */
    attribute?: string;
    /**
     * The operator of the promotion rule.
     */
    operator?: PromotionRuleOperatorValues;
    /**
     * The values of the promotion rule.
     */
    values: PromotionRuleValueDTO[];
}
/**
 * The promotion rule to be created.
 */
export interface CreatePromotionRuleDTO {
    /**
     * The description of the promotion rule.
     */
    description?: string | null;
    /**
     * The attribute of the promotion rule.
     */
    attribute: string;
    /**
     * The operator of the promotion rule.
     */
    operator: PromotionRuleOperatorValues;
    /**
     * The values of the promotion rule.
     * When provided, `PromotionRuleValue` records are
     * created and associated with the promotion rule.
     */
    values: string[] | string;
}
/**
 * The attributes to update in the promotion rule.
 */
export interface UpdatePromotionRuleDTO {
    /**
     * The ID of the promotion rule.
     */
    id: string;
    /**
     * The description of the promotion rule.
     */
    description?: string | null;
    /**
     * The attribute of the promotion rule.
     */
    attribute?: string;
    /**
     * The operator of the promotion rule.
     */
    operator?: PromotionRuleOperatorValues;
    /**
     * The values of the promotion rule.
     * When provided, `PromotionRuleValue` records are
     * created and associated with the promotion rule.
     */
    values?: string[] | string;
}
/**
 * The details required when removing a promotion rule.
 */
export interface RemovePromotionRuleDTO {
    /**
     * The ID of the promotion rule to remove.
     */
    id: string;
}
/**
 * The filters to apply on the retrieved promotion rules.
 */
export interface FilterablePromotionRuleProps extends BaseFilterable<FilterablePromotionRuleProps> {
    /**
     * The IDs to filter the promotion rules by.
     */
    id?: string[];
}
/**
 * @interface
 *
 * The promotion rule's possible types.
 */
export type PromotionRuleTypes = "buy_rules" | "target_rules" | "rules";
//# sourceMappingURL=promotion-rule.d.ts.map