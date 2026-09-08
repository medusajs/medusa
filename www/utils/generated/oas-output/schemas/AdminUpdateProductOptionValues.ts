/**
 * @schema AdminUpdateProductOptionValues
 * type: object
 * description: The details to update a product option's values.
 * x-schemaName: AdminUpdateProductOptionValues
 * required:
 *   - product_option_id
 * properties:
 *   product_option_id:
 *     type: string
 *     title: product_option_id
 *     description: The ID of the product option to update.
 *   add:
 *     type: array
 *     description: The values to add to the product option.
 *     items:
 *       oneOf:
 *         - type: string
 *           title: add
 *           description: The value to add to the product option.
 *         - type: object
 *           description: The details of the value to add to the product option.
 *           required:
 *             - value
 *           properties:
 *             value:
 *               type: string
 *               title: value
 *               description: The value to add to the product option.
 *   remove:
 *     type: array
 *     description: The values to remove from the product option.
 *     items:
 *       type: string
 *       title: remove
 *       description: The ID of the value to remove from the product option.
 * 
*/

