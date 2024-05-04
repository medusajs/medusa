import type { ProductCollection } from "./ProductCollection";
export interface AdminCollectionsListRes {
    /**
     * an array of collection details
     */
    collections: Array<ProductCollection>;
    /**
     * The total number of items available
     */
    count: number;
    /**
     * The number of product collections skipped when retrieving the product collections.
     */
    offset: number;
    /**
     * The number of items per page
     */
    limit: number;
}
