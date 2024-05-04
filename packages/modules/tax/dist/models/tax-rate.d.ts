import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import TaxRateRule from "./tax-rate-rule";
import TaxRegion from "./tax-region";
type OptionalTaxRateProps = DAL.SoftDeletableEntityDateColumns;
export declare const singleDefaultRegionIndexName = "IDX_single_default_region";
export default class TaxRate {
    [OptionalProps]?: OptionalTaxRateProps;
    id: string;
    rate: number | null;
    code: string | null;
    name: string;
    is_default: boolean;
    is_combinable: boolean;
    tax_region_id: string;
    tax_region: TaxRegion;
    rules: Collection<TaxRateRule, object>;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    created_by: string | null;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
