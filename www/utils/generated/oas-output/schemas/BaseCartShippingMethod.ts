/**
 * @schema BaseCartShippingMethod
 * type: object
 * description: A cart's shipping method.
 * x-schemaName: BaseCartShippingMethod
 * required:
 *   - id
 *   - cart_id
 *   - name
 *   - amount
 *   - is_tax_inclusive
 *   - created_at
 *   - updated_at
 *   - original_total
 *   - original_subtotal
 *   - original_tax_total
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_total
 *   - discount_tax_total
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The shipping method's ID.
 *   cart_id:
 *     type: string
 *     title: cart_id
 *     description: The ID of the cart this shipping method belongs to.
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
 *     description: Whether the shipping method's amount is tax inclusive.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the shipping option this method was created from.
 *   data:
 *     type: object
 *     description: The shipping method's data, useful for fulfillment handling by third-party services.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/cart/concepts#data-property
 *   metadata:
 *     type: object
 *     description: The shipping method's metadata, can hold custom key-value pairs.
 *   tax_lines:
 *     type: array
 *     description: The shipping method's tax lines.
 *     items:
 *       $ref: "#/components/schemas/BaseShippingMethodTaxLine"
 *   adjustments:
 *     type: array
 *     description: The shipping method's adjustments, such as applied promotions.
 *     items:
 *       $ref: "#/components/schemas/BaseShippingMethodAdjustment"
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
 *   original_total:
 *     type: string
 *     title: original_total
 *     description: The shipping method's total including taxes, excluding promotions.
 *   original_subtotal:
 *     type: string
 *     title: original_subtotal
 *     description: The shipping method's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: string
 *     title: original_tax_total
 *     description: The total taxes applied on the shipping method's amount including promotions.
 *   total:
 *     type: string
 *     title: total
 *     description: The shipping method's total amount including taxes and promotions.
 *   subtotal:
 *     type: string
 *     title: subtotal
 *     description: The shipping method's total amount excluding taxes, including promotions.
 *   tax_total:
 *     type: string
 *     title: tax_total
 *     description: The total taxes applied on the shipping method's amount including promotions.
 *   discount_total:
 *     type: string
 *     title: discount_total
 *     description: The total amount discounted.
 *   discount_tax_total:
 *     type: string
 *     title: discount_total
 *     description: The taxes applied on the discounted amount.
 * 
*/

