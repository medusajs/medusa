/**
 * @schema AdminUpdatePromotionRule
 * type: object
 * description: The properties to update in a buy rule.
 * required:
 *   - id
 *   - values
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The buy rule's ID.
 *   operator:
 *     type: string
 *     description: The operator used to check whether the buy rule applies on a cart. For example, `eq` means that the cart's value for the specified attribute must match the specified value.
 *     enum:
 *       - gte
 *       - lte
 *       - gt
 *       - lt
 *       - eq
 *       - ne
 *       - in
 *   description:
 *     type: string
 *     title: description
 *     description: The buy rule's description.
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The attribute to compare against when checking whether a promotion can be applied on a cart.
 *     example: items.product.id
 *   values:
 *     oneOf:
 *       - type: string
 *         title: values
 *         description: The attribute's value.
 *         example: prod_123
 *       - type: array
 *         description: The allowed attribute values.
 *         items:
 *           type: string
 *           title: values
 *           description: An attribute value.
 *           example: prod_123
 * x-schemaName: AdminUpdatePromotionRule
 * 
*/

