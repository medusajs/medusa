/**
 * @schema AdminApplicationMethod
 * type: object
 * description: The application method's details.
 * x-schemaName: AdminApplicationMethod
 * required:
 *   - id
 * properties:
 *   promotion:
 *     $ref: "#/components/schemas/AdminPromotion"
 *   target_rules:
 *     type: array
 *     description: The application method's target rules.
 *     items:
 *       $ref: "#/components/schemas/AdminPromotionRule"
 *   buy_rules:
 *     type: array
 *     description: The application method's buy rules.
 *     items:
 *       $ref: "#/components/schemas/AdminPromotionRule"
 *   id:
 *     type: string
 *     title: id
 *     description: The application method's ID.
 *   type:
 *     type: string
 *     description: The application method's type. If it's `fixed`, the promotion discounts a fixed amount. If it's `percentage`, the promotion discounts a percentage.
 *     enum:
 *       - fixed
 *       - percentage
 *   target_type:
 *     type: string
 *     description: Which item does the promotion apply to. `items` mean the promotion applies to the cart's items; `shipping_methods` means the promotion applies to the cart's shipping methods; `order`
 *       means the promotion applies on the entire order.
 *     enum:
 *       - items
 *       - shipping_methods
 *       - order
 *   allocation:
 *     type: string
 *     description: How is the promotion amount discounted. `each` means the discounted amount is applied on each applicable item; `across` means the discounted amount is split accross the applicable items.
 *     enum:
 *       - each
 *       - across
 *   value:
 *     type: number
 *     title: value
 *     description: The amount to be discounted.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The application method's currency code.
 *     example: usd
 *   max_quantity:
 *     type: number
 *     title: max_quantity
 *     description: The max quantity allowed in the cart for the associated promotion to be applied.
 *   buy_rules_min_quantity:
 *     type: number
 *     title: buy_rules_min_quantity
 *     description: The minimum quantity required for a `buyget` promotion to be applied. For example, if the promotion is a "Buy 2 shirts get 1 free", the value of this attribute is `2`.
 *   apply_to_quantity:
 *     type: number
 *     title: apply_to_quantity
 *     description: The quantity that results from matching the `buyget` promotion's condition. For example, if the promotion is a "Buy 2 shirts get 1 free", the value of this attribute is `1`.
 * 
*/

