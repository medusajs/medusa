/**
 * @schema BaseShippingMethodAdjustment
 * type: object
 * description: The adjustment's details.
 * x-schemaName: BaseShippingMethodAdjustment
 * required:
 *   - shipping_method
 *   - shipping_method_id
 *   - id
 *   - amount
 *   - cart_id
 *   - created_at
 *   - updated_at
 * properties:
 *   shipping_method:
 *     $ref: "#/components/schemas/BaseCartShippingMethod"
 *   shipping_method_id:
 *     type: string
 *     title: shipping_method_id
 *     description: The ID of the shipping method the adjustment is applied on.
 *   id:
 *     type: string
 *     title: id
 *     description: The adjustment's ID.
 *   code:
 *     type: string
 *     title: code
 *     description: The adjustment's code.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The adjustment's amount.
 *   cart_id:
 *     type: string
 *     title: cart_id
 *     description: The ID of the associated cart.
 *   description:
 *     type: string
 *     title: description
 *     description: The adjustment's description.
 *   promotion_id:
 *     type: string
 *     title: promotion_id
 *     description: The ID of the promotion applied by this adjustment.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The adjustment's provider ID.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the adjustment was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the adjustment was updated.
 * 
*/

