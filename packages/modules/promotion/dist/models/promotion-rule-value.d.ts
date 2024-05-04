import PromotionRule from "./promotion-rule";
export default class PromotionRuleValue {
    id: string;
    promotion_rule: PromotionRule;
    value: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
//# sourceMappingURL=promotion-rule-value.d.ts.map