import { ApplicationMethodAllocationValues, ApplicationMethodTargetTypeValues, ApplicationMethodTypeValues, BigNumberRawValue, DAL } from "@medusajs/types";
import { BigNumber } from "@medusajs/utils";
import { Collection, OptionalProps } from "@mikro-orm/core";
import Promotion from "./promotion";
import PromotionRule from "./promotion-rule";
type OptionalFields = "value" | "max_quantity" | "apply_to_quantity" | "buy_rules_min_quantity" | "allocation" | DAL.SoftDeletableEntityDateColumns;
export default class ApplicationMethod {
    [OptionalProps]?: OptionalFields;
    id: string;
    value: BigNumber | number | null;
    raw_value: BigNumberRawValue | null;
    max_quantity?: number | null;
    apply_to_quantity?: number | null;
    buy_rules_min_quantity?: number | null;
    type: ApplicationMethodTypeValues;
    target_type: ApplicationMethodTargetTypeValues;
    allocation?: ApplicationMethodAllocationValues;
    promotion: Promotion;
    target_rules: Collection<PromotionRule, object>;
    buy_rules: Collection<PromotionRule, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
//# sourceMappingURL=application-method.d.ts.map