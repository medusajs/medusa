import { Collection } from "@mikro-orm/core";
import { Product } from "./index";
import ProductOptionValue from "./product-option-value";
declare class ProductOption {
    id: string;
    title: string;
    product_id: string | null;
    product: Product | null;
    values: Collection<ProductOptionValue, object>;
    metadata?: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    onInit(): void;
}
export default ProductOption;
