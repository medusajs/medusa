import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
import Price from "./price";
import PriceSet from "./price-set";
import RuleType from "./rule-type";
type OptionalFields = DAL.SoftDeletableEntityDateColumns;
export default class PriceRule {
    [OptionalProps]?: OptionalFields;
    id: string;
    price_set_id: string;
    price_set: PriceSet;
    rule_type_id: string;
    rule_type: RuleType;
    value: string;
    priority: number;
    price_id: string;
    price: Price;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    beforeCreate(): void;
    onInit(): void;
}
export {};
