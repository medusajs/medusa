/**
 * @schema AdminBatchProductRequest
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminBatchProductRequest
 * properties:
 *   create:
 *     type: array
 *     description: The product's create.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProduct"
 *   update:
 *     type: array
 *     description: The product's update.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateProduct"
 *   delete:
 *     type: array
 *     description: The product's delete.
 *     items:
 *       type: string
 *       title: delete
 *       description: The delete's details.
 * 
*/

