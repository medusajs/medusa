type Order = {
    [key: string]: "ASC" | "DESC" | Order;
};
type Selects = {
    [key: string]: boolean | Selects;
};
type Relations = {
    [key: string]: boolean | Relations;
};
export declare function buildSelects(selectCollection: string[]): Selects;
export declare function buildRelations(relationCollection: string[]): Relations;
/**
 * Convert an order of dot string into a nested object
 * @example
 * input: { id: "ASC", "items.title": "ASC", "items.variant.title": "ASC" }
 * output: {
 *   "id": "ASC",
 *   "items": {
 *     "id": "ASC",
 *     "variant": {
 *        "title": "ASC"
 *     }
 *   },
 * }
 * @param orderBy
 */
export declare function buildOrder<T>(orderBy: {
    [k: string]: "ASC" | "DESC";
}): Order;
export {};
