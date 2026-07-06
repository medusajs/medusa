/**
 * @schema AdminUpdateProductCategory
 * type: object
 * description: The properties to update in the product category.
 * properties:
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
 *     description: The product category's handle. Must be a unique value.
 *   is_internal:
 *     type: boolean
 *     title: is_internal
 *     description: Whether the product category is only used for internal purposes and shouldn't be shown the customer.
 *   is_active:
 *     type: boolean
 *     title: is_active
 *     description: Whether the product category is active.
 *   parent_category_id:
 *     type: string
 *     title: parent_category_id
 *     description: The ID of a parent category.
 *   metadata:
 *     type: object
 *     description: The product category's metadata. Can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 *   rank:
 *     type: number
 *     title: rank
 *     description: The product category's rank among other categories.
 *   external_id:
 *     type: string
 *     title: external_id
 *     description: The product category's external ID used to link it with external systems.
 * x-schemaName: AdminUpdateProductCategory
 * 
*/

