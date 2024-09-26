/**
 * @schema StoreProductCategory
 * type: object
 * description: The category's details.
 * x-schemaName: StoreProductCategory
 * required:
 *   - id
 *   - name
 *   - description
 *   - handle
 *   - rank
 *   - parent_category_id
 *   - parent_category
 *   - category_children
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   products:
 *     type: array
 *     description: The category's products.
 *     items:
 *       $ref: "#/components/schemas/StoreProduct"
 *   id:
 *     type: string
 *     title: id
 *     description: The category's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The category's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The category's description.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The category's handle.
 *   rank:
 *     type: number
 *     title: rank
 *     description: The category's rank.
 *   parent_category_id:
 *     type: string
 *     title: parent_category_id
 *     description: The ID of the category's parent.
 *   parent_category:
 *     $ref: "#/components/schemas/StoreProductCategory"
 *   category_children:
 *     type: array
 *     description: The category's children.
 *     items:
 *       $ref: "#/components/schemas/StoreProductCategory"
 *   metadata:
 *     type: object
 *     description: The category's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the category was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the category was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the category was deleted.
 * 
*/

