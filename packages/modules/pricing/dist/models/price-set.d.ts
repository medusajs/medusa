import { Collection } from "@mikro-orm/core";
import Price from "./price";
import PriceRule from "./price-rule";
import RuleType from "./rule-type";
export declare const PriceSetIdPrefix = "pset";
export default class PriceSet {
    id: string;
    prices: Collection<Price, object>;
    price_rules: Collection<PriceRule, object>;
    rule_types: Collection<RuleType, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
