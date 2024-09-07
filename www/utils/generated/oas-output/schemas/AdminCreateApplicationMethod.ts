/**
 * @schema AdminCreateApplicationMethod
 * type: object
 * description: The application method's details.
 * x-schemaName: AdminCreateApplicationMethod
 * required:
 *   - value
 *   - type
 *   - target_type
 * properties:
 *   description:
 *     type: string
 *     title: description
 *     description: The application method's description.
 *   value:
 *     type: number
 *     title: value
 *     description: The discounted amount applied by the associated promotion based on the `type`.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The application method's currency code.
 *   max_quantity:
 *     type: number
 *     title: max_quantity
 *     description: The max quantity allowed in the cart for the associated promotion to be applied.
 *   type:
 *     type: string
 *     description: The type of the application method indicating how the associated promotion is applied.
 *     enum:
 *       - fixed
 *       - percentage
 *   target_type:
 *     type: string
 *     description: The target type of the application method indicating whether the associated promotion is applied to the cart's items, shipping methods, or the whole order.
 *     enum:
 *       - items
 *       - shipping_methods
 *       - order
 *   allocation:
 *     type: string
 *     description: The allocation value that indicates whether the associated promotion is applied on each item in a cart or split between the items in the cart.
 *     enum:
 *       - each
 *       - across
 *   target_rules:
 *     type: array
 *     description: The application method's target rules.
 *     items:
 *       $ref: "#/components/schemas/AdminCreatePromotionRule"
 *   buy_rules:
 *     type: array
 *     description: The application method's buy rules.
 *     items:
 *       $ref: "#/components/schemas/AdminCreatePromotionRule"
 *   apply_to_quantity:
 *     type: number
 *     title: apply_to_quantity
 *     description: The quantity that results from matching the `buyget` promotion's condition. For example, if the promotion is a "Buy 2 shirts get 1 free", the value f this attribute is `1`.
 *   buy_rules_min_quantity:
 *     type: number
 *     title: buy_rules_min_quantity
 *     description: The minimum quantity required for a `buyget` promotion to be applied. For example, if the promotion is a "Buy 2 shirts get 1 free", the value of this attribute is `2`.
 * 
*/

