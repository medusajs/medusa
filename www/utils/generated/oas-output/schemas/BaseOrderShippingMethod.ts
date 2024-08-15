/**
 * @schema BaseOrderShippingMethod
 * type: object
 * description: The shipping method's shipping methods.
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
 *     description: The shipping method's order id.
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
 *     description: The shipping method's is tax inclusive.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The shipping method's shipping option id.
 *   data:
 *     type: object
 *     description: The shipping method's data.
 *   metadata:
 *     type: object
 *     description: The shipping method's metadata.
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
 *     oneOf:
 *       - type: string
 *         title: original_total
 *         description: The shipping method's original total.
 *       - type: number
 *         title: original_total
 *         description: The shipping method's original total.
 *       - type: string
 *         title: original_total
 *         description: The shipping method's original total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_subtotal:
 *     oneOf:
 *       - type: string
 *         title: original_subtotal
 *         description: The shipping method's original subtotal.
 *       - type: number
 *         title: original_subtotal
 *         description: The shipping method's original subtotal.
 *       - type: string
 *         title: original_subtotal
 *         description: The shipping method's original subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_tax_total:
 *     oneOf:
 *       - type: string
 *         title: original_tax_total
 *         description: The shipping method's original tax total.
 *       - type: number
 *         title: original_tax_total
 *         description: The shipping method's original tax total.
 *       - type: string
 *         title: original_tax_total
 *         description: The shipping method's original tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   total:
 *     oneOf:
 *       - type: string
 *         title: total
 *         description: The shipping method's total.
 *       - type: number
 *         title: total
 *         description: The shipping method's total.
 *       - type: string
 *         title: total
 *         description: The shipping method's total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   subtotal:
 *     oneOf:
 *       - type: string
 *         title: subtotal
 *         description: The shipping method's subtotal.
 *       - type: number
 *         title: subtotal
 *         description: The shipping method's subtotal.
 *       - type: string
 *         title: subtotal
 *         description: The shipping method's subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   tax_total:
 *     oneOf:
 *       - type: string
 *         title: tax_total
 *         description: The shipping method's tax total.
 *       - type: number
 *         title: tax_total
 *         description: The shipping method's tax total.
 *       - type: string
 *         title: tax_total
 *         description: The shipping method's tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   discount_total:
 *     oneOf:
 *       - type: string
 *         title: discount_total
 *         description: The shipping method's discount total.
 *       - type: number
 *         title: discount_total
 *         description: The shipping method's discount total.
 *       - type: string
 *         title: discount_total
 *         description: The shipping method's discount total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   discount_tax_total:
 *     oneOf:
 *       - type: string
 *         title: discount_tax_total
 *         description: The shipping method's discount tax total.
 *       - type: number
 *         title: discount_tax_total
 *         description: The shipping method's discount tax total.
 *       - type: string
 *         title: discount_tax_total
 *         description: The shipping method's discount tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The shipping method's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The shipping method's updated at.
 * 
*/

