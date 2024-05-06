/**
 * @schema StoreProductCategoryListResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: StoreProductCategoryListResponse
 * required:
 *   - product_categories
 *   - limit
 *   - offset
 *   - count
 * properties:
 *   product_categories:
 *     type: array
 *     description: The product category's product categories.
 *     items:
 *       $ref: "#/components/schemas/ProductCategoryResponse"
 *   limit:
 *     type: number
 *     title: limit
 *     description: The product category's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The product category's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The product category's count.
 * 
*/

