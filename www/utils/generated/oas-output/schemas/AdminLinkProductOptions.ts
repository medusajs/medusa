/**
 * @schema AdminLinkProductOptions
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminLinkProductOptions
 * properties:
 *   add:
 *     type: array
 *     description: The product's add.
 *     items:
 *       oneOf:
 *         - type: string
 *           title: add
 *           description: The add's details.
 *         - $ref: "#/components/schemas/AdminCreateProductOption"
 *         - $ref: "#/components/schemas/AdminLinkProductOptionWithValues"
 *   remove:
 *     type: array
 *     description: The product's remove.
 *     items:
 *       type: string
 *       title: remove
 *       description: The remove's details.
 *   update:
 *     type: array
 *     description: The product's update.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateProductOptionValues"
 * 
*/

