/**
 * @schema BaseOrderShippingMethodTaxLine
 * type: object
 * description: The tax line's details.
 * x-schemaName: BaseOrderShippingMethodTaxLine
 * properties:
 *   shipping_method:
 *     $ref: "#/components/schemas/BaseOrderShippingMethod"
 *   shipping_method_id:
 *     type: string
 *     title: shipping_method_id
 *     description: The ID of the shipping method this tax line belongs to.
 *   total:
 *     type: number
 *     title: total
 *     description: The shipping method's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The shipping method's total excluding taxes, including promotions.
 *   id:
 *     type: string
 *     title: id
 *     description: The tax line's ID.
 *   description:
 *     type: string
 *     title: description
 *     description: The tax line's description.
 *   tax_rate_id:
 *     type: string
 *     title: tax_rate_id
 *     description: The ID of the applied tax rate.
 *   code:
 *     type: string
 *     title: code
 *     description: The code that the tax rate is identified by.
 *   rate:
 *     type: number
 *     title: rate
 *     description: The rate to charge.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the tax provider handling the tax calculation.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the tax line was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the tax line was updated.
 * required:
 *   - shipping_method
 *   - shipping_method_id
 *   - total
 *   - subtotal
 *   - id
 *   - code
 *   - rate
 *   - created_at
 *   - updated_at
 * 
*/

