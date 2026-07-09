/**
 * @schema AdminCreateProductOption
 * type: object
 * description: The product option's details.
 * x-schemaName: AdminCreateProductOption
 * required:
 *   - title
 *   - values
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The product option's title.
 *   values:
 *     type: array
 *     description: The product option's values.
 *     items:
 *       type: string
 *       title: values
 *       description: An option value.
 *       example: "Red"
 *   ranks:
 *     type: object
 *     description: The ranking of the option's values. The keys are the value names and the values are their respective ranks.
 *     example:
 *       Small: 1
 *       Medium: 2
 *       Large: 3
 *   is_exclusive:
 *     type: boolean
 *     title: is_exclusive
 *     description: Whether the option is exclusive to the product.
 * 
*/

