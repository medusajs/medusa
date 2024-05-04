import { DAL, PromotionRuleOperatorValues } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import ApplicationMethod from "./application-method";
import Promotion from "./promotion";
import PromotionRuleValue from "./promotion-rule-value";
type OptionalFields = "description" | DAL.SoftDeletableEntityDateColumns;
type OptionalRelations = "values" | "promotions";
export default class PromotionRule {
    [OptionalProps]?: OptionalFields | OptionalRelations;
    id: string;
    description: string | null;
    attribute: string;
    operator: PromotionRuleOperatorValues;
    values: Collection<PromotionRuleValue, object>;
    promotions: Collection<Promotion, object>;
    method_target_rules: Collection<ApplicationMethod, object>;
    method_buy_rules: Collection<ApplicationMethod, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
//# sourceMappingURL=promotion-rule.d.ts.map