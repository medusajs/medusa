import { Collection } from "@mikro-orm/core";
import { ProductOption, ProductVariant } from "./index";
declare class ProductOptionValue {
    id: string;
    value: string;
    option_id: string | null;
    option: ProductOption | null;
    variants: Collection<ProductVariant, object>;
    metadata?: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    onInit(): void;
}
export default ProductOptionValue;
