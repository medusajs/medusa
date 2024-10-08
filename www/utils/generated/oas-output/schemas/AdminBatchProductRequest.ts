/**
 * @schema AdminBatchProductRequest
 * type: object
 * description: The products to create, update, or delete.
 * x-schemaName: AdminBatchProductRequest
 * properties:
 *   create:
 *     type: array
 *     description: The products to create.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProduct"
 *   update:
 *     type: array
 *     description: The products to update.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateProduct"
 *   delete:
 *     type: array
 *     description: The products to delete.
 *     items:
 *       type: string
 *       title: delete
 *       description: A product's ID.
 * 
*/

