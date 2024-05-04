/**
 * @description
 * This function is used to flatten nested objects and arrays
 *
 * @example
 *
 * ```ts
 * const data = {
 *   root_level_property: "root level",
 *   products: [
 *     {
 *       id: "1",
 *       name: "product 1",
 *       variants: [
 *         { id: "1.1", name: "variant 1.1" },
 *         { id: "1.2", name: "variant 1.2" },
 *       ],
 *     },
 *     {
 *       id: "2",
 *       name: "product 2",
 *       variants: [
 *         { id: "2.1", name: "variant 2.1" },
 *         { id: "2.2", name: "variant 2.2" },
 *       ],
 *     },
 *   ],
 * }
 *
 * const flat = deepFlatMap(
 *   data,
 *   "products.variants",
 *   ({ root_, products, variants }) => {
 *     return {
 *       root_level_property: root_.root_level_property,
 *       product_id: products.id,
 *       product_name: products.name,
 *       variant_id: variants.id,
 *       variant_name: variants.name,
 *     }
 *   }
 * )
 * ```
 */
export declare function deepFlatMap(data: any, path: string, callback: (context: Record<string, any>) => any): any[];
