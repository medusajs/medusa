import { Collection } from "@mikro-orm/core";
import Product from "./product";
declare class ProductCollection {
    id: string;
    title: string;
    handle?: string;
    products: Collection<Product, object>;
    metadata?: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    onInit(): void;
}
export default ProductCollection;
