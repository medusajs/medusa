/**
 * @schema AdminLinkProductOptions
 * type: object
 * description: The details of linking product options to a product.
 * x-schemaName: AdminLinkProductOptions
 * properties:
 *   add:
 *     type: array
 *     description: The options to add to the product.
 *     items:
 *       oneOf:
 *         - type: string
 *           title: add
 *           description: An ID of an existing global option to associate with the product.
 *         - type: object
 *           description: An option to create exclusive to the product.
 *           x-schemaName: AdminCreateProductOption
 *           required:
 *             - title
 *             - values
 *           properties:
 *             title:
 *               type: string
 *               title: title
 *               description: The option's title.
 *             values:
 *               type: array
 *               description: The option's values.
 *               items:
 *                 type: string
 *                 title: values
 *                 description: An option value.
 *             ranks:
 *               type: object
 *               description: The ranking of the option's values. The keys are the value names and the values are their respective ranks.
 *               example:
 *                 Small: 1
 *                 Medium: 2
 *                 Large: 3
 *             is_exclusive:
 *               type: boolean
 *               title: is_exclusive
 *               description: Whether the option is exclusive to the product.
 *         - type: object
 *           description: The option to link with specific values to the product.
 *           x-schemaName: AdminLinkProductOptionWithValues
 *           required:
 *             - id
 *             - value_ids
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The option's ID.
 *             value_ids:
 *               type: array
 *               description: The IDs of the option values to associate with the product. This is useful to associate specific values from a global option.
 *               items:
 *                 type: string
 *                 title: value_ids
 *                 description: The value's ID.
 *   remove:
 *     type: array
 *     description: The IDs of the product options to remove from the product.
 *     items:
 *       type: string
 *       title: remove
 *       description: The ID of the product option to remove.
 * 
*/

