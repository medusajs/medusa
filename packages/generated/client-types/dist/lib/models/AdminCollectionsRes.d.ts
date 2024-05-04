import { SetRelation } from "../core/ModelUtils";
import type { ProductCollection } from "./ProductCollection";
/**
 * The collection's details.
 */
export interface AdminCollectionsRes {
    /**
     * Product Collection details.
     */
    collection: SetRelation<ProductCollection, "products">;
}
