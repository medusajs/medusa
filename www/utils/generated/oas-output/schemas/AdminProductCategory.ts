/**
 * @schema AdminProductCategory
 * type: object
 * description: The product category's details.
 * x-schemaName: AdminProductCategory
 * required:
 *   - category_children
 *   - parent_category
 *   - name
 *   - description
 *   - id
 *   - created_at
 *   - updated_at
 *   - handle
 *   - deleted_at
 *   - is_active
 *   - is_internal
 *   - rank
 *   - parent_category_id
 * properties:
 *   category_children:
 *     type: array
 *     description: The category's children.
 *     items:
 *       $ref: "#/components/schemas/AdminProductCategory"
 *   parent_category:
 *     $ref: "#/components/schemas/AdminProductCategory"
 *   products:
 *     type: array
 *     description: The category's products.
 *     items:
 *       $ref: "#/components/schemas/AdminProduct"
 *   name:
 *     type: string
 *     title: name
 *     description: The category's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The category's description.
 *   id:
 *     type: string
 *     title: id
 *     description: The category's ID.
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
 *   handle:
 *     type: string
 *     title: handle
 *     description: The category's unique handle.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the category was deleted.
 *   is_active:
 *     type: boolean
 *     title: is_active
 *     description: Whether the category is active. If disabled, the category isn't shown in the storefront.
 *   is_internal:
 *     type: boolean
 *     title: is_internal
 *     description: Whether the category is internal. If enabled, the category is only seen by admin users.
 *   rank:
 *     type: number
 *     title: rank
 *     description: The category's rank among sibling categories.
 *   parent_category_id:
 *     type: string
 *     title: parent_category_id
 *     description: The ID of the category's parent.
 * 
*/

