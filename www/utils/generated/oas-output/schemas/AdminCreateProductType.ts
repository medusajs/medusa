/**
 * @schema AdminCreateProductType
 * type: object
 * description: The details of the product type to create.
 * x-schemaName: AdminCreateProductType
 * required:
 *   - value
 * properties:
 *   metadata:
 *     type: object
 *     description: The product's metadata, used to store custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 *   value:
 *     type: string
 *     title: value
 *     description: The product type's value.
 *   external_id:
 *     type: string
 *     title: external_id
 *     description: The ID of the product type in an external or third-party system.
 * 
*/

