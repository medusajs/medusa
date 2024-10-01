/**
 * @schema OrderShippingMethod
 * type: object
 * description: The shipping method's details.
 * x-schemaName: OrderShippingMethod
 * required:
 *   - id
 *   - order_id
 *   - name
 *   - amount
 *   - raw_amount
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
 *   - raw_original_total
 *   - raw_original_subtotal
 *   - raw_original_tax_total
 *   - raw_total
 *   - raw_subtotal
 *   - raw_tax_total
 *   - raw_discount_total
 *   - raw_discount_tax_total
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The shipping method's ID.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order that the shipping method belongs to.
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
 *   raw_amount:
 *     type: object
 *     description: The shipping method's raw amount.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw amount's value.
 *           - type: number
 *             title: value
 *             description: The raw amount's value.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: Whether the shipping method's amount includes taxes.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the shipping option this method was created from.
 *   data:
 *     type: object
 *     description: The shipping method's data, useful for the fulfillment provider handling the fulfillment.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/order/concepts#data-property
 *   metadata:
 *     type: object
 *     description: The shipping method's metadata, can hold custom key-value pairs.
 *   tax_lines:
 *     type: array
 *     description: The shipping method's tax lines.
 *     items:
 *       $ref: "#/components/schemas/OrderShippingMethodTaxLine"
 *   adjustments:
 *     type: array
 *     description: The shipping method's adjustments.
 *     items:
 *       $ref: "#/components/schemas/OrderShippingMethodAdjustment"
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
 *     type: number
 *     title: original_total
 *     description: The shipping method's total including taxes, excluding promotions.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The shipping method's subtotal excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The total taxes of the shipping method excluding promotions.
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
 *     description: The total taxes of the shipping method, including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The shipping method's discount total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The total taxes of the discount amount.
 *   raw_original_total:
 *     type: object
 *     description: The shipping method's raw original total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original total's value.
 *           - type: number
 *             title: value
 *             description: The raw original total's value.
 *   raw_original_subtotal:
 *     type: object
 *     description: The shipping method's raw original subtotal.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original subtotal's value.
 *           - type: number
 *             title: value
 *             description: The raw original subtotal's value.
 *   raw_original_tax_total:
 *     type: object
 *     description: The shipping method's raw original tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw original tax total's value.
 *   raw_total:
 *     type: object
 *     description: The shipping method's raw total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw total's value.
 *           - type: number
 *             title: value
 *             description: The raw total's value.
 *   raw_subtotal:
 *     type: object
 *     description: The shipping method's raw subtotal.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw subtotal's value.
 *           - type: number
 *             title: value
 *             description: The raw subtotal's value.
 *   raw_tax_total:
 *     type: object
 *     description: The shipping method's raw tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw tax total's value.
 *   raw_discount_total:
 *     type: object
 *     description: The shipping method's raw discount total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw discount total's value.
 *           - type: number
 *             title: value
 *             description: The raw discount total's value.
 *   raw_discount_tax_total:
 *     type: object
 *     description: The shipping method's raw discount tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw discount tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw discount tax total's value.
 * 
*/

