/**
 * @schema BaseApplicationMethod
 * type: object
 * description: The promotion's application method.
 * x-schemaName: BaseApplicationMethod
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The application method's ID.
 *   type:
 *     type: string
 *     description: The application method's type.
 *     enum:
 *       - fixed
 *       - percentage
 *   target_type:
 *     type: string
 *     description: The application method's target type.
 *     enum:
 *       - items
 *       - shipping_methods
 *       - order
 *   allocation:
 *     type: string
 *     description: The application method's allocation.
 *     enum:
 *       - each
 *       - across
 *   value:
 *     type: number
 *     title: value
 *     description: The application method's value.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The application method's currency code.
 *   max_quantity:
 *     type: number
 *     title: max_quantity
 *     description: The application method's max quantity.
 *   buy_rules_min_quantity:
 *     type: number
 *     title: buy_rules_min_quantity
 *     description: The application method's buy rules min quantity.
 *   apply_to_quantity:
 *     type: number
 *     title: apply_to_quantity
 *     description: The application method's apply to quantity.
 *   promotion:
 *     $ref: "#/components/schemas/BasePromotion"
 *   target_rules:
 *     type: array
 *     description: The application method's target rules.
 *     items:
 *       $ref: "#/components/schemas/BasePromotionRule"
 *   buy_rules:
 *     type: array
 *     description: The application method's buy rules.
 *     items:
 *       $ref: "#/components/schemas/BasePromotionRule"
 * 
*/

