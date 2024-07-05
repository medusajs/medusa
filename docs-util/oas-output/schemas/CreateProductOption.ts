/**
 * @schema CreateProductOption
 * type: object
 * description: SUMMARY
 * x-schemaName: CreateProductOption
 * required:
 *   - title
 *   - values
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The product's title.
 *   values:
 *     oneOf:
 *       - type: array
 *         description: The product's values.
 *         items:
 *           type: string
 *           title: values
 *           description: The value's values.
 *       - type: array
 *         description: The product's values.
 *         items:
 *           type: object
 *           description: The value's values.
 *           required:
 *             - value
 *           properties:
 *             value:
 *               type: string
 *               title: value
 *               description: The value's details.
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The product's product id.
 * 
*/

