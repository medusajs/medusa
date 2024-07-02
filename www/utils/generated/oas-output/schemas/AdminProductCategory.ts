/**
 * @schema AdminProductCategory
 * type: object
 * description: The category's categories.
 * x-schemaName: AdminProductCategory
 * required:
 *   - category_children
 *   - parent_category
 *   - name
 *   - description
 *   - id
 *   - handle
 *   - created_at
 *   - updated_at
 *   - deleted_at
 *   - parent_category_id
 *   - is_internal
 *   - is_active
 *   - rank
 * properties:
 *   category_children:
 *     type: array
 *     description: The category's category children.
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
 *   handle:
 *     type: string
 *     title: handle
 *     description: The category's handle.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The category's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The category's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The category's deleted at.
 *   parent_category_id:
 *     type: string
 *     title: parent_category_id
 *     description: The category's parent category id.
 *   is_internal:
 *     type: boolean
 *     title: is_internal
 *     description: The category's is internal.
 *   is_active:
 *     type: boolean
 *     title: is_active
 *     description: The category's is active.
 *   rank:
 *     type: number
 *     title: rank
 *     description: The category's rank.
 * 
*/

