import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import Country from "./country";
type RegionOptionalProps = "countries" | DAL.SoftDeletableEntityDateColumns;
export default class Region {
    [OptionalProps]?: RegionOptionalProps;
    id: string;
    name: string;
    currency_code: string;
    automatic_taxes: boolean;
    countries: Collection<Country, object>;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
