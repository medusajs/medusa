import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import TaxProvider from "./tax-provider";
import TaxRate from "./tax-rate";
type OptionalTaxRegionProps = DAL.SoftDeletableEntityDateColumns;
export declare const countryCodeProvinceIndexName = "IDX_tax_region_unique_country_province";
export declare const taxRegionProviderTopLevelCheckName = "CK_tax_region_provider_top_level";
export declare const taxRegionCountryTopLevelCheckName = "CK_tax_region_country_top_level";
export default class TaxRegion {
    [OptionalProps]?: OptionalTaxRegionProps;
    id: string;
    provider_id: string | null;
    provider: TaxProvider;
    country_code: string;
    province_code: string | null;
    parent_id: string | null;
    parent: TaxRegion;
    tax_rates: Collection<TaxRate, object>;
    children: Collection<TaxRegion, object>;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    created_by: string | null;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
