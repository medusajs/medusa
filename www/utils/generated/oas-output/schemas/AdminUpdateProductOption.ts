/**
 * @schema AdminUpdateProductOption
 * type: object
 * description: The details to update in a product option.
 * x-schemaName: AdminUpdateProductOption
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The option's title.
 *   values:
 *     type: array
 *     description: The option's values.
 *     items:
 *       type: string
 *       title: values
 *       description: An option value.
 *   id:
 *     type: string
 *     title: id
 *     description: The option's ID.
 *   ranks:
 *     type: object
 *     description: The product option's ranks.
 *   is_exclusive:
 *     type: boolean
 *     title: is_exclusive
 *     description: Whether the product option is exclusive to the product. If disabled, the product option can be used by other products.
 *   metadata:
 *     type: object
 *     description: Key-value pairs that hold additional information about the product option.
 * 
*/

