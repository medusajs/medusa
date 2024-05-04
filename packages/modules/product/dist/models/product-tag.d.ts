import { Collection } from "@mikro-orm/core";
import Product from "./product";
declare class ProductTag {
    id: string;
    value: string;
    metadata?: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    products: Collection<Product, object>;
    onInit(): void;
}
export default ProductTag;
