/**
 * @schema BaseOrderShippingDetail
 * type: object
 * description: Details of changes to a shipping method.
 * x-schemaName: BaseOrderShippingDetail
 * required:
 *   - id
 *   - shipping_method_id
 *   - shipping_method
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The ID of the new changes to the shipping method.
 *   shipping_method_id:
 *     type: string
 *     title: shipping_method_id
 *     description: The ID of the shipping method.
 *   shipping_method:
 *     $ref: "#/components/schemas/BaseOrderShippingMethod"
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The ID of the associated claim.
 *   exchange_id:
 *     type: string
 *     title: exchange_id
 *     description: The ID of the associated exchange.
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The ID of the associated return.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the shipping method change was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the shipping method change was updated.
 * 
*/

