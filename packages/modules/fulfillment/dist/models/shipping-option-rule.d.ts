import { DAL } from "@medusajs/types";
import { RuleOperator } from "@medusajs/utils";
import { OptionalProps } from "@mikro-orm/core";
import ShippingOption from "./shipping-option";
type ShippingOptionRuleOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class ShippingOptionRule {
    [OptionalProps]?: ShippingOptionRuleOptionalProps;
    id: string;
    attribute: string;
    operator: Lowercase<keyof typeof RuleOperator>;
    value: string | string[] | null;
    shipping_option_id: string;
    shipping_option: ShippingOption;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
