/**
 * @schema BaseOrderShippingMethod
 * type: object
 * description: The shipping method's details.
 * x-schemaName: BaseOrderShippingMethod
 * required:
 *   - id
 *   - order_id
 *   - name
 *   - amount
 *   - is_tax_inclusive
 *   - shipping_option_id
 *   - data
 *   - metadata
 *   - original_total
 *   - original_subtotal
 *   - original_tax_total
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_total
 *   - discount_tax_total
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The shipping method's ID.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order the shipping method belongs to.
 *   name:
 *     type: string
 *     title: name
 *     description: The shipping method's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The shipping method's description.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The shipping method's amount.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: Whether the shipping method's amount includes applied taxes.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the shipping option this method was created from.
 *   data:
 *     type: object
 *     description: The shipping method's data, useful for fulfillment provider handling its fulfillment.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/shipping-option#data-property
 *   metadata:
 *     type: object
 *     description: The shipping method's metadata, can hold custom key-value pairs.
 *   tax_lines:
 *     type: array
 *     description: The shipping method's tax lines.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderShippingMethodTaxLine"
 *   adjustments:
 *     type: array
 *     description: The shipping method's adjustments.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderShippingMethodAdjustment"
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The shipping method's total including taxes, excluding promotions.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The shipping method's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The shipping method's total taxes excluding promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The shipping method's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The shipping method's total excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The shipping method's tax total including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The total discounts applied on the shipping method.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The taxes applied on the discount amount.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the shipping method was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the shipping method was updated.
 *   detail:
 *     $ref: "#/components/schemas/BaseOrderShippingDetail"
 * 
*/

