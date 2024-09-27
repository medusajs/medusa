/**
 * @schema StoreProductCategory
 * type: object
 * description: The category's categories.
 * x-schemaName: StoreProductCategory
 * properties:
 *   products:
 *     type: array
 *     description: The parent category's products.
 *     items:
 *       $ref: "#/components/schemas/StoreProduct"
 *   parent_category:
 *     $ref: "#/components/schemas/StoreProductCategory"
 *   category_children:
 *     type: array
 *     description: The category's parent category.
 *     items:
 *       $ref: "#/components/schemas/StoreProductCategory"
 *   name:
 *     type: string
 *     title: name
 *     description: The parent category's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The parent category's description.
 *   metadata:
 *     type: object
 *     description: The parent category's metadata.
 *   id:
 *     type: string
 *     title: id
 *     description: The parent category's ID.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The parent category's handle.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The parent category's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The parent category's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The parent category's deleted at.
 *   rank:
 *     type: number
 *     title: rank
 *     description: The parent category's rank.
 *   parent_category_id:
 *     type: string
 *     title: parent_category_id
 *     description: The parent category's parent category id.
 * required:
 *   - parent_category
 *   - category_children
 *   - name
 *   - description
 *   - id
 *   - handle
 *   - created_at
 *   - updated_at
 *   - deleted_at
 *   - rank
 *   - parent_category_id
 * 
*/

