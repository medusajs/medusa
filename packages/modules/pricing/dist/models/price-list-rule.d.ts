import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import PriceList from "./price-list";
import PriceListRuleValue from "./price-list-rule-value";
import RuleType from "./rule-type";
type OptionalFields = DAL.SoftDeletableEntityDateColumns;
export default class PriceListRule {
    [OptionalProps]: OptionalFields;
    id: string;
    rule_type_id: string;
    rule_type: RuleType;
    price_list_rule_values: Collection<PriceListRuleValue, object>;
    price_list_id: string;
    price_list: PriceList;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    beforeCreate(): void;
    onInit(): void;
}
export {};
