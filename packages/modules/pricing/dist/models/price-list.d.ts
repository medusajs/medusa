import { DAL } from "@medusajs/types";
import { PriceListStatus, PriceListType } from "@medusajs/utils";
import { Collection, OptionalProps } from "@mikro-orm/core";
import Price from "./price";
import PriceListRule from "./price-list-rule";
import RuleType from "./rule-type";
type OptionalFields = "starts_at" | "ends_at" | DAL.SoftDeletableEntityDateColumns;
export declare const PriceListIdPrefix = "plist";
export default class PriceList {
    [OptionalProps]: OptionalFields;
    id: string;
    title: string;
    description: string;
    status: PriceListStatus;
    type: PriceListType;
    starts_at: Date | null;
    ends_at: Date | null;
    prices: Collection<Price, object>;
    price_list_rules: Collection<PriceListRule, object>;
    rule_types: Collection<RuleType, object>;
    rules_count: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
