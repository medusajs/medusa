/**
 * @schema AdminBatchProductVariantRequest
 * type: object
 * description: The product variants to create, update, or delete.
 * x-schemaName: AdminBatchProductVariantRequest
 * properties:
 *   create:
 *     type: array
 *     description: The product variants to create.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProductVariant"
 *   update:
 *     type: array
 *     description: The product variants to update.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateProductVariant"
 *   delete:
 *     type: array
 *     description: The product variants to delete.
 *     items:
 *       type: string
 *       title: delete
 *       description: A product variant's ID.
 * 
*/

