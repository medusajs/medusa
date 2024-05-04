import { Collection, EventArgs } from "@mikro-orm/core";
import Product from "./product";
declare class ProductCategory {
    id: string;
    name?: string;
    description?: string;
    handle?: string;
    mpath?: string;
    is_active?: boolean;
    is_internal?: boolean;
    rank?: number;
    parent_category_id?: string | null;
    parent_category?: ProductCategory;
    category_children: Collection<ProductCategory, object>;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    products: Collection<Product, object>;
    onInit(): Promise<void>;
    onCreate(args: EventArgs<ProductCategory>): Promise<void>;
}
export default ProductCategory;
