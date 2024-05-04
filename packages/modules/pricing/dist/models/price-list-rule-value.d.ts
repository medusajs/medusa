import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
import PriceListRule from "./price-list-rule";
type OptionalFields = DAL.SoftDeletableEntityDateColumns;
export default class PriceListRuleValue {
    [OptionalProps]?: OptionalFields;
    id: string;
    price_list_rule_id: string;
    price_list_rule: PriceListRule;
    value: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
