import { Collection } from "@mikro-orm/core";
import Product from "./product";
declare class ProductImage {
    id: string;
    url: string;
    metadata?: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    products: Collection<Product, object>;
    onInit(): void;
    onCreate(): void;
}
export default ProductImage;
