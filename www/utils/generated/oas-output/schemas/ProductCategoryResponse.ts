/**
 * @schema ProductCategoryResponse
 * type: object
 * description: The product category's details.
 * x-schemaName: ProductCategoryResponse
 * required:
 *   - id
 *   - name
 *   - description
 *   - handle
 *   - is_active
 *   - is_internal
 *   - rank
 *   - parent_category_id
 *   - created_at
 *   - updated_at
 *   - parent_category
 *   - category_children
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The product category's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The product category's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The product category's description.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The product category's handle.
 *   is_active:
 *     type: boolean
 *     title: is_active
 *     description: The product category's is active.
 *   is_internal:
 *     type: boolean
 *     title: is_internal
 *     description: The product category's is internal.
 *   rank:
 *     type: number
 *     title: rank
 *     description: The product category's rank.
 *   parent_category_id:
 *     type: string
 *     title: parent_category_id
 *     description: The product category's parent category id.
 *   created_at:
 *     oneOf:
 *       - type: string
 *         title: created_at
 *         description: The product category's created at.
 *       - type: string
 *         title: created_at
 *         description: The product category's created at.
 *         format: date-time
 *   updated_at:
 *     oneOf:
 *       - type: string
 *         title: updated_at
 *         description: The product category's updated at.
 *       - type: string
 *         title: updated_at
 *         description: The product category's updated at.
 *         format: date-time
 *   parent_category:
 *     $ref: "#/components/schemas/ProductCategoryResponse"
 *   category_children:
 *     type: array
 *     description: The product category's category children.
 *     items:
 *       $ref: "#/components/schemas/ProductCategoryResponse"
 * 
*/

