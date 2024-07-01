/**
 * @schema AdminBatchProductVariantRequest
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminBatchProductVariantRequest
 * properties:
 *   create:
 *     type: array
 *     description: The product's create.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProductVariant"
 *   update:
 *     type: array
 *     description: The product's update.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateProductVariant"
 *   delete:
 *     type: array
 *     description: The product's delete.
 *     items:
 *       type: string
 *       title: delete
 *       description: The delete's details.
 * 
*/

